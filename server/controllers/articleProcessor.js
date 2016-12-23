const app = require('../index'),
      db = app.get('db'),
      winston = require('../services/winston');


processData = (post) => {
  console.log(`processing ${post}`);
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
    console.log(`Total: ${arr.length} | NEWS: ${newsArr.length} | self: ${self} | imgur: ${imgur} | redditUploads: ${redditUploads} | reddit: ${reddIt}`);
    // winston.log2.info(newsArr);
    // winston.log.info(arr);
    newsArr.every((post) => {
      let redditid = post.data.id;
      let continue = true;
      db.run("SELECT scraped.id FROM scraped JOIN articles ON scraped.articleid = articles.id WHERE lower(redditid) = lower($1)", [redditid], (err, res) => {
        if (err) winston.error.error(err);
        if (res.length >= 1) {
          console.log('skipping duplicate');
          return (coninue = true);
        } else {
          uniquePost.push(post);
          return processData(uniquePost);
        }
      });
      if (true) {

      }
    });
  }

}
