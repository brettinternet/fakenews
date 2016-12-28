const app = require('../index'),
      db = app.get('db'),
      winston = require('../services/winston'),
      lexrank = require('lexrank'),
      watson = require('watson-developer-cloud'),
      config = require('../config'),
      pos = require('pos'),
      request = require('request'),
      extractor = require('unfluff');

const getWatson = watson.alchemy_language({
  api_key: config.watsonKey
});

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
  request(obj.url, (err, res, raw) => {
    if (!err && res.statusCode == 200) {
      getHtmlData(raw);
    } else {
      winston.get.error(err);
    }
  });
  getHtmlData = (html) => {
    console.log(obj);
    extract = extractor.lazy(html, 'en');
    obj.title = extract.title();
    obj.imgdesc = extract.softTitle();
    cannonLink = extract.canonicalLink();
    if (cannonLink) {
      obj.url = cannonLink;
    }
    obj.headline = extract.description();
    obj.tags = extract.tags();
    obj.img = extract.image();
    obj.fulltext = extract.text();
    getSummary(obj);
  }
}

getSummary = (obj) => {
  let topLines = lexrank.summarize(obj.fulltext, 6, function (err, topLines, text) {
    if (err) winston.process.error(err);
    obj.body = text;
    getWatson.entities({url: obj.url}, (err, res) => {
      if (err) winston.process.error(err);
      let entities = res.entities;
      processData(obj, entities);
    });
  });
}

processData = (obj, entities) => {
  obj.breakingnews = false;
  if (obj.score > 20000) {
    obj.breakingnews = true;
  }
  for (var i = 0; i < entities.length; i++) {
    // add entities as tags
    // if (entities[i].disambiguated) {
    //   obj.tags.push(entities[i].text)
    // }
    if (entities[i].type == 'City') {
      obj.city = entities[i].text;
    }
    if (entities[i].type == 'StateOrCounty') {
      obj.state = entities[i].text;
    }
    if (entities[i].type == 'Country') {
      obj.country = entities[i].text;
    }
  }
  if (obj.country) {
    var searchCountry = `%${obj.country}%`;
    console.log('Country: ', obj.country);
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
          flag: true,
          origin: obj.url
        };
        if (obj.country) {
          articleValues.countryid = countryid;
        }
        db.articles.insert(articleValues, (err, article) => {
          if (err) winston.process.error(err);
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
            tagsObj.tag = obj.tags[i];
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

// get grammar
// getWatson.relations({text: obj.body}, (err, res) => {
//   if (err) winston.process.error(err);
//   let parsedRes = JSON.stringify(res, null, 2);
//   console.log('relations', parsedRes);
//   console.log(obj.body);
// });
// also sentiment, then use sentiment results to make article more extreme;
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


module.exports = {

  findPost: (body, category) => {
    let arr = body.data.children,
        self = 0,
        imgur = 0,
        redditUploads = 0,
        reddIt = 0,
        newsArr = [],
        uniquePost = [];
    arr.forEach((post) => {
      let website = post.data.domain.toLowerCase();
      if (website.search('self.') > -1) {
        console.log();
        self += 1;
      } else if (website.search('imgur') > -1) {
        console.log();
        imgur += 1;
      } else if (website.search('reddituploads') > -1) {
        console.log();
        redditUploads += 1;
      } else if (website.search('redd.it') > -1) {
        console.log();
        reddIt += 1;
      } else {
        newsArr.push(post);
      }
    });
    console.log(`category: ${category} total: ${arr.length} | NEWS: ${newsArr.length} | self: ${self} | imgur: ${imgur} | redditUploads: ${redditUploads} | reddit: ${reddIt}`);
    function checkPost(posts, i) {
      let redditid = posts[i].data.id;
      db.run("SELECT scraped.id FROM scraped JOIN articles ON scraped.articleid = articles.id WHERE lower(redditid) = lower($1)", [redditid], (err, res) => {
        if (err) winston.process.error(err);
        if (res.length >= 1) {
          console.log('Skipping duplicate');
          db.scraped.update({id: res[0].id, score: posts[i].data.score}, (err, res) => {
            if (err) winston.process.error(err);
            console.log('Score updated');
          });
          i++;
          checkPost(newsArr, i);
        } else {
          console.log('Found a post');
          uniquePost.push(newsArr[i]);
          aggregateData(uniquePost, category);
          return true;
        };
      });
    }
    checkPost(newsArr, 0);
  }
}
