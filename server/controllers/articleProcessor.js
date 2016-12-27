const app = require('../index'),
      db = app.get('db'),
      winston = require('../services/winston'),
      lexrank = require('lexrank'),
      pos = require('pos');

lies = (arr) => {
  // for (var i = 0; i < arr.length; i++) {
  //   if (arr[i].tag === 'PDT') {
  //     arr[i].word = 'none'
  //     }
  //   }
  // }
  console.log('done');
}


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

processUrl = (url) => {
  let topLines = lexrank.summarizePage(url, 4, function (err, topLines, text) {
    if (err) winston.process.error(err);
    // winston.log.info(topLines);
    // winston.log2.info(text);
    processText(text);
  });
}

aggregateData = (post) => {
  console.log(`Aggregating ${post}`);
  // winston.log.info(post)
  aggregatedObj = function(post) {
    let obj = post.data;
    this.domain = obj.domain;
    this.id = obj.id;
    this.score = obj.score;
    this.url = obj.url;
    this.title = obj.title;
    this.redditurl = obj.permalink;
    this.type = obj.post_hint;
  }
  var newsObj = new aggregatedObj(post[0]);
  // processData(newsObj);
  console.log(newsObj.title);
  console.log(newsObj.url);
  processUrl(newsObj.url);
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
          // update duplicate post's score
          i++;
          checkPost(newsArr, i);
        } else {
          console.log('Found a post');
          uniquePost.push(newsArr[i]);
          aggregateData(uniquePost);
          return true;
        };
      });
    }
    checkPost(newsArr, 0);
  }
}
