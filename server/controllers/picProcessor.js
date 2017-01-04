const app = require('../index'),
      db = app.get('db'),
      winston = require('../services/winston'),
      config = require('../config'),
      bannedDomains = require('../services/bannedDomains'),
      clarifai = require('clarifai');

const clar = new Clarifai.App(
  config.clarifaiClientID,
  config.clarifaiClientSecret
);

module.exports = {

  findPicPost: (body, category) => {
    let arr = body.data.children,
        self = 0,
        other = 0,
        banned = 0,
        over18 = 0,
        picsArr = [],
        uniquePost = [];
    arr.forEach((post) => {
      let website = post.data.domain.toLowerCase(),
          url = post.data.url;
      if (website.search('self.') > -1) {
        self += 1;
      } else if (bannedDomains.array.indexOf(website) > -1) {
        banned += 1;
      } else if (post.data.over_18 == true) {
        over18 += 1;
      } else if (website.search('reddituploads') > -1) {
        picsArr.push(post);
      } else if (url.substr(url.length-3) == 'gif' || url.substr(url.length-4) == 'gifv' || url.substr(url.length-3) == 'jpg' || url.substr(url.length-3) == 'png') {
        picsArr.push(post);
      } else if (post.data.media) {
        let link = post.data.media.oembed.thumbnail_url;
        if (link.substr(url.length-3) == '?fb') {
          let img = link.substr(0, link.length-3);
          post.data.url = img;
          picsArr.push(post);
        }
      } else {
        other += 1;
      }
    });
    console.log('=========================');
    console.log(`PICS: category: ${category} total: ${arr.length} | usablePics: ${picsArr.length} | self: ${self} | banned: ${banned} | over18: ${over18} | other: ${other}`);
    function checkPicPost(posts, i) {
      if (posts[i]) {
        let redditid = posts[i].data.id;
        db.run("SELECT scraped.id FROM scraped WHERE lower(redditid) = lower($1)", [redditid], (err, res) => {
          if (err) winston.process.error(err);
          if (res.length >= 1) {
            db.scraped.update({id: res[0].id, score: posts[i].data.score}, (err, res) => {
              if (err) winston.process.error(err);
            });
            i++;
            checkPicPost(picsArr, i);
          } else {
            console.log('PROCESS: found a pic post');
            uniquePost.push(picsArr[i]);
            aggregatePic(uniquePost, category);
            return true;
          };
        });
      } else {
        console.log('only duplicates found');
      }
    }
    checkPicPost(picsArr, 0);
  }
}

aggregatePic = (post, category) => {
  aggregatedPicObj = function(post, category) {
    let obj = post.data;
    this.domain = obj.domain;
    this.redditid = obj.id;
    this.score = obj.score;
    this.url = obj.url;
    this.imgnail = obj.thumbnail;
    this.reddittitle = obj.title;
    this.redditurl = obj.permalink;
    this.type = obj.post_hint;
    this.category = category;
  }
  var picsObj = new aggregatedPicObj(post[0], category);
  getTags(picsObj);
}


getTags = (obj) => {
  obj.url = obj.url.replace(/&amp;/g, '&');
  console.log(`pic URL ${obj.url}`);
  if (obj.url.substr(obj.url.length-4) == 'gifv') {
    obj.url = obj.url.slice(0,-1);
    processPic(obj, [])
  } else {
    clar.models.predict(Clarifai.GENERAL_MODEL, obj.url).then(
    (response) => {
      let tags = response.data.outputs[0].data.concepts;
      tags = tags.slice(0, 3).map(tag => {
        if (tag.name !== 'no person' && tag.name != '') return tag.name;
      });
      processPic(obj, tags);
    },
    (err) => {
      winston.process.error('CLARIFAI ERROR');
    });
  }
}

processPic = (obj, tags) => {
  obj.tags = tags;
  obj.breakingnews = false;
  if (obj.score > 20000) obj.breakingnews = true;
  if (!obj.imgnail) obj.imgnail = obj.img;
  db.run("SELECT id FROM categories WHERE upper(category) = upper($1)", [obj.category], (err, res) => {
    if (err) winston.process.error(err);
    let categoryid = res[0].id;
    let articleValues = {
      published: true,
      title: obj.reddittitle,
      img: obj.url,
      imgnail: obj.imgnail,
      body: obj.body,
      categoryid: categoryid,
      breakingnews: obj.breakingnews,
      origin: obj.url,
      picpost: true
    };
    db.articles.insert(articleValues, (err, article) => {
      if (err) winston.process.error(err);
      console.log(`DATABASE: new pic in ${obj.category}`);
      let scrapedValues = {
        redditid: obj.redditid,
        domain: obj.domain,
        articleid: article.id,
        score: obj.score,
        redditurl: obj.redditurl,
        reddittitle: obj.reddittitle
      }
      if (obj.type) scrapedValues.mediatype = obj.type;
      db.scraped.insert(scrapedValues, (err, res) => {
        if (err) winston.process.error(err);
      });
      for (let i = 0; i < obj.tags.length; i++) {
        let tagsObj = {};
        if (obj.tags[i]) {
          tagsObj.tag = obj.tags[i].toLowerCase();
          tagsObj.articleid = article.id;
          db.tags.insert(tagsObj, (err, res) => {
            if (err) winston.process.error(err);
          });
        }
      };
    });
  });
}
