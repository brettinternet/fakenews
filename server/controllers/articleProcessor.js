const app = require('../index'),
      db = app.get('db'),
      winston = require('../services/winston'),
      lexrank = require('lexrank'),
      watson = require('watson-developer-cloud'),
      config = require('../config'),
      pos = require('pos'),
      request = require('request').defaults({maxRedirects:15}),
      bannedDomains = require('../services/bannedDomains'),
      verbSrv = require('../services/verbSrv'),
      picProcessor = require('./picProcessor'),
      extractor = require('unfluff');

const getWatson = watson.alchemy_language({
  api_key: config.watsonKey
});

// TODO: Use embed.ly for sports / vids

skipArticle = (obj) => {
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
        mp4 = 0,
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
      } else if (url.substr(url.length-3) == 'mp4') {
        mp4 += 1;
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
    let getOptions = {
      extract: 'entities',
      // sentiment: 1,
      url: obj.url
    };
    getWatson.entities(getOptions, (err, res) => {
      if (err) {
        console.log('error');
        skipArticle(obj);
        winston.process.error(err);
      }
      let entities = [];
      if (res && res.entities) entities = res.entities;
      getSentiment(obj, entities);
    });
  }
  if (obj.category === 'front') {
    console.log(`PROCESS: smmry summarizing text`);
    request('http://api.smmry.com?SM_API_KEY=' + config.smmryApi + '&SM_WITH_BREAK' + '&SM_URL=' + obj.url, (err, res, raw) => {
      if (!err && res.statusCode == 200) {
        let body = JSON.parse(raw);
        if (body.sm_api_message) winston.process.warn(body.sm_api_message);
        if (body.sm_api_error) winston.process.error(body.sm_api_error);
        obj.body = body.sm_api_content.replace(/\[BREAK\]/g, '<br/>');
        if (body.sm_api_keyword_array) obj.tags.push(body.sm_api_keyword_array);
        getEntities(obj);
      } else if (obj.fulltext) {
        winston.get.error(err);
        console.log(`PROCESS: smmry failure, lexrank summarizing text`);
        let topLines = lexrank.summarize(obj.fulltext, 6, function (err, topLines, text) {
          if (err) {
            winston.process.error(err);
            skipArticle(obj);
          }
          obj.body = text;
          getEntities(obj);
        });
      }
    });
  } else if (obj.fulltext) {
    console.log(`PROCESS: lexrank summarizing text`);
    let topLines = lexrank.summarize(obj.fulltext, 6, function (err, topLines, text) {
      if (err) winston.process.error(err);
      obj.body = text;
      getEntities(obj);
    });
  } else {
    skipArticle(obj);
  }
}

processData = (obj, entities) => {
  obj.breakingnews = false;
  if (obj.score > 20000) {
    obj.breakingnews = true;
  }
  // if (obj.domain) {
  //
  // }
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
      // winston.log2.info('CITY:', cities);
    }
    if (entities[i].type == 'StateOrCounty') {
      states.push(entities[i].text);
      // winston.log2.info('CITY:', cities);
    }
    if (entities[i].type == 'Country') {
      countries.push(entities[i].text);
      // winston.log2.info('CITY:', cities);
    }
  }
  if (tempTags && !obj.tags) {
    obj.tags.push(tempTags[0]);
  }
  if (cities.length > 0) {
    obj.city = cities[0].toLowerCase();
    // winston.log.info('CITY:', cities);
  }
  if (states.length > 0) {
    obj.state = states[0].toLowerCase();
    // winston.log.info('STATE:', states);
  }
  if (countries.length > 0) {
    obj.country = countries[0];
    // winston.log.info('COUNTRY:', countries);
  }
  if (!obj.imgnail) obj.imgnail = obj.img;
  if (obj.city || obj.state || obj.country) {
    console.log('PROCESS: getting location');
    getByLocation = (location) => {
      str = location.split(' ').join('+');
      request('https://maps.googleapis.com/maps/api/geocode/json?address=' +str+ '&key=' +config.googleApiKey, (err, res, raw) => {
        if (!err && res.statusCode == 200) {
          let body = JSON.parse(raw);
          if (body.results[0]) {
            obj.lat = body.results[0].geometry.location.lat;
            obj.long = body.results[0].geometry.location.lng;
            saveData(obj);
          } else if (obj.country) {
            getByLocation(obj.country);
          } else if (obj.state) {
            getByLocation(obj.state);
          } else {
            saveData(obj);
          }
        } else {
          winston.get.error(err);
          saveData(obj);
        }
      });
    }
    if (obj.city) {
      getByLocation(obj.city);
    } else if (obj.country) {
      getByLocation(obj.country);
    } else if (obj.state) {
      getByLocation(obj.state);
    } else {
      saveData(obj);
    }
  } else saveData(obj);
}

saveData = (obj) => {
  console.log('PROCESS: saving data');
  if (obj.country) {
    var searchCountry = `%${obj.country}%`;
  } else {
    var searchCountry = null;
  }
  db.run("SELECT id FROM authors WHERE categoryid = (SELECT id FROM categories WHERE upper(category) = upper($1)) OFFSET floor(random()*(2)) LIMIT 1", [obj.category], (err, res) => {
    if (err) winston.process.error(err);
    let authorid = res[0].id;
    db.run("SELECT id FROM countries WHERE upper(name) like upper($1)", [searchCountry], (err, resC) => {
      if (err) winston.process.error(err);
      if (resC) var countryid = res[0].id;
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
          origin: obj.url,
          lat: obj.lat,
          long: obj.long
        };
        if (obj.country) {
          articleValues.countryid = countryid;
        }
        db.articles.insert(articleValues, (err, article) => {
          if (err) {
            winston.process.error(err, articleValues);
            obj.error = 'ERROR: could not save article';
            skipArticle(obj);
          } else {
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
          };
        });
      });
    });
  });
}


// ######################################################
// WARNING: EVIL CODE :)
// ######################################################

// TODO: imgthumbnails https://www.npmjs.com/package/gm

getSentiment = (obj, entities) => {
  console.log('PROCESS: getting sentiment');
  let getOptions = {
    extract: 'doc-sentiment',
    url: obj.url
  };
  getWatson.sentiment(getOptions, (err, res) => {
    if (err) winston.process.error(err);
    let docSentiment = {};
    if (res && res.docSentiment) docSentiment = res.docSentiment;
    processText(obj, entities, docSentiment);
  });
}

processText = (obj, entities, docSentiment) => {
  console.log('PROCESS: transforming text');
  transformText = (text) => {
    let words = new pos.Lexer().lex(text),
        tagger = new pos.Tagger(),
        taggedWords = tagger.tag(words),
        arr = [];
    for (i in taggedWords) {
      let taggedWord = taggedWords[i],
          wordObj = {};
      wordObj.word = taggedWord[0];
      wordObj.tag = taggedWord[1];
      arr.push(wordObj);
    }
    console.log('PROCESS: parts of speech');
    let isIgnore = (ignoreArr, word) => {
      return ignoreArr.indexOf(word.toLowerCase()) > -1;
    }
    if (docSentiment.type === 'negative') {
      arr.forEach((word, i, array) => {
        let len = array.length;
        if (!isIgnore(verbSrv.ignoreVerbs, array[(i+len-1)%len].word) && !isIgnore(verbSrv.ignoreVerbs, word.word) && !isIgnore(verbSrv.ignoreFirstVerb, arr[(i+1)%len].tag)) {
          if (word.tag === 'VB') word.word = verbSrv.positive.VB();
          if (word.tag === 'VBD') word.word = verbSrv.positive.VBD();
          if (word.tag === 'VBG') word.word = verbSrv.positive.VBG();
          if (word.tag === 'VBN') word.word = verbSrv.positive.VBN();
          if (word.tag === 'VBP') word.word = verbSrv.positive.VBP();
          if (word.tag === 'VBZ') word.word = verbSrv.positive.VBZ();
        }
      });
    } else {
      arr.forEach((word, i, array) => {
        let len = array.length;
        if (!isIgnore(verbSrv.ignoreVerbs, array[(i+len-1)%len].word) && !isIgnore(verbSrv.ignoreVerbs, word.word) && !isIgnore(verbSrv.ignoreFirstVerb, arr[(i+1)%len].tag)) {
          if (word.tag === 'VB') word.word = verbSrv.negative.VB();
          if (word.tag === 'VBD') word.word = verbSrv.negative.VBD();
          if (word.tag === 'VBG') word.word = verbSrv.negative.VBG();
          if (word.tag === 'VBN') word.word = verbSrv.negative.VBN();
          if (word.tag === 'VBP') word.word = verbSrv.negative.VBP();
          if (word.tag === 'VBZ') word.word = verbSrv.negative.VBZ();
        }
      });
    }
    let newText = '';
    arr.forEach((word) => {
      if (word.tag.search(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g) > -1) {
        newText += (word.word);
      } else {
        newText += (' ' + word.word);
      }
    });
    if (newText.substr(newText.length-7) === '[BREAK]') {
      newText = newText.slice(0, (newText.length-7));
      console.log('had to cut last [break]');
    }
    if (!newText.charAt(newText.length-1).match(/[!.?"”']/g) && !newText.charAt(newText.length-2).match(/[!.?"”']/g)) {
      let puncArr = ['?', '!'];
      let punc = puncArr[Math.floor(Math.random() * puncArr.length)];
      newText += punc;
    }
    return newText;
  }
  if (obj.headline) obj.headline = transformText(obj.headline);
  obj.title = transformText(obj.title);
  obj.body = transformText(obj.body);
  processData(obj, entities);
  // winston.log2.info(obj.headline);
  // winston.log2.info(obj.body);
  // console.log('done');
}

// && !isIgnore(verbSrv.ignoreFirstVerb, arr[(i+1)%len].tag)

// arr = [
//     ['be', 'not be'],
//     ['is','is not'],
//   ];
//
// text = ['i', 'be'];
// text.forEach(function(word) = {
//   testing = () => {
//     arr.some(function(el) = {
//       return el.indexOf(word.toLowerCase() > -1)
//     })
//   }
//     if (testing()) {
//       console.log('hurray');
//     }
//    }
// });
//
// console.log(arr);



//
