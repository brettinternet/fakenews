const app = require('../index'),
      db = app.get('db'),
      winston = require('../services/winston'),
      lexrank = require('lexrank'),
      watson = require('watson-developer-cloud'),
      config = require('../config'),
      pos = require('pos'),
      request = require('request').defaults({maxRedirects:15}),
      bannedDomains = require('../services/bannedDomains'),
      picProcessor = require('./picProcessor'),
      extractor = require('unfluff');

const getWatson = watson.alchemy_language({
  api_key: config.watsonKey
});

// TODO: Use embed.ly for sports / vids

skipArticle = () => {
  let scrapedValues = {
    redditid: obj.redditid,
    domain: obj.domain,
    score: obj.score,
    redditurl: obj.redditurl,
    reddittitle: obj.reddittitle,
    fulltext: obj.error
  }
  if (obj.type) {
    scrapedValues.mediatype = obj.type;
  }
  db.scraped.insert(scrapedValues, (err, res) => {
    if (err) winston.process.error(err);
    console.log('DATABASE: recorded error id');
  });
}

module.exports = {

  findPost: (body, category) => {
    let arr = body.data.children,
        self = 0,
        imgur = 0,
        redditUploads = 0,
        redd_it = 0,
        reddit = 0,
        otherImg = 0,
        banned = 0,
        newsArr = [],
        picsArr = [],
        uniquePost = [];
    arr.forEach((post) => {
      let website = post.data.domain.toLowerCase(),
          url = post.data.url;
      if (website.search('self.') > -1) {
        self += 1;
      } else if (website.search('imgur') > -1) {
        imgur += 1;
        picsArr.push(post);
      } else if (website.search('reddituploads') > -1) {
        redditUploads += 1;
        picsArr.push(post);
      } else if (website.search('redd.it') > -1) {
        redd_it += 1;
        picsArr.push(post);
      } else if (website.search('reddit.com') > -1) {
        reddit += 1;
        picsArr.push(post);
      } else if (url.substr(url.length-3) == 'gif' || url.substr(url.length-4) == 'gifv' || url.substr(url.length-3) == 'jpg' || url.substr(url.length-3) == 'png') {
        otherImg += 1;
        picsArr.push(post);
      } else if (bannedDomains.array.indexOf(website) > -1) {
        banned += 1;
      } else {
        newsArr.push(post);
      }
    });
    if (picsArr.length > 0) {
      let body = {data: {children: picsArr}};
      picProcessor.findPicPost(body, category);
    }
    console.log('=========================');
    console.log(`HTTP: category: ${category} total: ${arr.length} | news: ${newsArr.length} | self: ${self} | imgur: ${imgur} | redditUp: ${redditUploads} | redd.it: ${redd_it} | reddit: ${reddit} | otherImg: ${otherImg} | banned: ${banned}`);
    function checkPost(posts, i) {
      let redditid = posts[i].data.id;
      db.run("SELECT scraped.id FROM scraped WHERE lower(redditid) = lower($1)", [redditid], (err, res) => {
        if (err) winston.process.error(err);
        if (res.length >= 1) {
          db.scraped.update({id: res[0].id, score: posts[i].data.score}, (err, res) => {
            if (err) winston.process.error(err);
          });
          i++;
          checkPost(newsArr, i);
        } else {
          console.log('PROCESS: found a post');
          uniquePost.push(newsArr[i]);
          aggregateData(uniquePost, category);
          return true;
        };
      });
    }
    if (newsArr.length > 0) checkPost(newsArr, 0);
  }
}

aggregateData = (post, category) => {
  aggregatedObj = function(post, category) {
    let obj = post.data;
    this.domain = obj.domain;
    this.redditid = obj.id;
    this.score = obj.score;
    this.url = obj.url;
    this.reddittitle = obj.title;
    this.redditurl = obj.permalink;
    this.type = obj.post_hint;
    this.category = category;
  }
  var newsObj = new aggregatedObj(post[0], category);
  processUrl(newsObj);
}

processUrl = (obj) => {
  if (obj.type === 'rich:video') {
    obj.type = 'video';
  }
  obj.url = obj.url.replace(/&amp;/g, '&');
  console.log(`PROCESS: getting HTML: ${obj.url}`);
  request(obj.url, (err, res, raw) => {
    if (!err && res.statusCode == 200) {
      getHtmlData(raw);
    } else {
      winston.get.error(err);
      obj.error = 'ERROR: could not get HTML from URL';
      skipArticle(obj);
    }
  });
  getHtmlData = (html) => {
    console.log(`PROCESS: processing HTML`);
    extract = extractor.lazy(html, 'en');
    obj.title = extract.title();
    obj.imgdesc = extract.softTitle();
    cannonLink = extract.canonicalLink();
    if (cannonLink) obj.url = cannonLink;
    obj.headline = extract.description();
    obj.tags = extract.tags();
    obj.img = extract.image(); // TODO: If null image, get different img
    obj.fulltext = extract.text();
    getSummary(obj);
  }
}

getSummary = (obj) => {
  let getEntities = (obj) => {
    console.log(`PROCESS: getting entities`);
    getWatson.entities({url: obj.url}, (err, res) => {
      if (err) winston.process.error(err);
      let entities = [];
      if (res) entities = res.entities;
      processData(obj, entities);
    });
  }
  if (obj.fulltext) {
    console.log(`PROCESS: summarizing text`);
    let topLines = lexrank.summarize(obj.fulltext, 6, function (err, topLines, text) {
      if (err) winston.process.error(err);
      obj.body = text;
      getEntities(obj);
    });
  } else {
    let scrapedValues = {
      redditid: obj.redditid,
      domain: obj.domain,
      score: obj.score,
      redditurl: obj.redditurl,
      reddittitle: obj.reddittitle,
      fulltext: obj.url,
      mediatype: 'error'
    }
    db.scraped.insert(scrapedValues, (err, res) => {
      if (err) winston.process.error(err);
    });
  }
}

processData = (obj, entities) => {
  obj.breakingnews = false;
  if (obj.score > 20000) {
    obj.breakingnews = true;
  }
  let cities = [],
      states = [],
      countries = [],
      tempTags = [];
  for (var i = 0; i < entities.length; i++) {
    if (!obj.tags) {
      if (entities[i].disambiguated) {
        obj.tags.push(entities[i].text)
      } else {
        tempTags.push(entities[i].text)
      }
    }
    if (entities[i].type == 'City') {
      cities.push(entities[i].text);
      winston.log2.info('CITY:', cities);
    }
    if (entities[i].type == 'StateOrCounty') {
      states.push(entities[i].text);
      winston.log2.info('CITY:', cities);
    }
    if (entities[i].type == 'Country') {
      countries.push(entities[i].text);
      winston.log2.info('CITY:', cities);
    }
  }
  if (tempTags && !obj.tags) {
    obj.tags.push(tempTags[0]);
  }
  if (cities.length > 0) {
    obj.city = cities[0].toLowerCase();
    winston.log.info('CITY:', cities);
  }
  if (states.length > 0) {
    obj.state = states[0].toLowerCase();
    winston.log.info('STATE:', states);
  }
  if (countries.length > 0) {
    obj.country = countries[0];
    winston.log.info('COUNTRY:', countries);
  }
  if (obj.country) {
    var searchCountry = `%${obj.country}%`;
    console.log('PROCESS: using country: ', obj.country);
  } else {
    var searchCountry = null;
  }
  if (!obj.imgnail) {
    obj.imgnail = obj.img;
  }
  db.run("SELECT id FROM authors WHERE categoryid = (SELECT id FROM categories WHERE upper(category) = upper($1)) OFFSET floor(random()*(2)) LIMIT 1", [obj.category], (err, res) => {
    if (err) winston.process.error(err);
    let authorid = res[0].id;
    db.run("SELECT id FROM countries WHERE upper(name) like upper($1)", [searchCountry], (err, resC) => {
      if (err) winston.process.error(err);
      if (resC) {
        var countryid = res[0].id;
      }
      db.run("SELECT id FROM categories WHERE upper(category) = upper($1)", [obj.category], (err, res) => {
        if (err) winston.process.error(err);
        let categoryid = res[0].id;
        if (obj.headline) {
          if (obj.headline.length > 2000) {
            let removed = obj.headline.slice(1998);
          }
        }
        let articleValues = {
          published: true,
          authorid: authorid,
          city: obj.city,
          state: obj.state,
          title: obj.title,
          img: obj.img,
          imgnail: obj.imgnail,
          imgdesc: obj.imgdesc,
          headline: obj.headline,
          body: obj.body,
          categoryid: categoryid,
          breakingnews: obj.breakingnews,
          picpost: false,
          origin: obj.url
        };
        if (obj.country) {
          articleValues.countryid = countryid;
        }
        db.articles.insert(articleValues, (err, article) => {
          if (err) {
            winston.process.error(err, articleValues);
            obj.error = 'ERROR: could not save article';
            skipArticle(obj);
          }
          console.log(`DATABASE: new article in ${obj.category}`);
          let scrapedValues = {
            redditid: obj.redditid,
            domain: obj.domain,
            articleid: article.id,
            score: obj.score,
            redditurl: obj.redditurl,
            reddittitle: obj.reddittitle,
            fulltext: obj.fulltext
          }
          if (obj.type) {
            scrapedValues.mediatype = obj.type;
          }
          db.scraped.insert(scrapedValues, (err, res) => {
            if (err) winston.process.error(err);
          });
          for (let i = 0; i < obj.tags.length; i++) {
            let tagsObj = {};
            tagsObj.tag = obj.tags[i].toLowerCase();
            tagsObj.articleid = article.id;
            db.tags.insert(tagsObj, (err, res) => {
              if (err) winston.process.error(err);
            });
          };
        });
      });
    });
  });
}


// ######################################################
// ######################################################

// TODO: MAKE THE NEWS FAKE! :)
// TODO: imgthumbnails https://www.npmjs.com/package/gm

// IDEA: make into happy news by replacing verbs with positive ones!

// get grammar
// getWatson.relations({text: obj.body}, (err, res) => {
//   if (err) winston.process.error(err);
//   let parsedRes = JSON.stringify(res, null, 2);
//   console.log('relations', parsedRes);
//   console.log(obj.body);
// });
// also sentiment, then use sentiment results to make article more extreme;
// http://www.ibm.com/watson/developercloud/alchemy-language/api/v1/#entities
// http://www.ibm.com/watson/developercloud/alchemy-language/api/v1/?node#targeted_sentiment

// skipping for now
processText = (text) => {
  let words = new pos.Lexer().lex(text),
      tagger = new pos.Tagger(),
      taggedWords = tagger.tag(words),
      arr = [];
  for (i in taggedWords) {
    let taggedWord = taggedWords[i],
        obj = {};
    obj.word = taggedWord[0];
    obj.tag = taggedWord[1];
    arr.push(obj);
  }
  lies(arr);
}

lies = (arr) => {
  // for (var i = 0; i < arr.length; i++) { // https://github.com/dariusk/pos-js
  //   if (arr[i].tag === 'PDT') {
  //     arr[i].word = 'none'
  //     }
  //   }
  // }
  console.log('done');
}
