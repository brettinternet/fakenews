/*
inspiration: http://www.realtruenews.org/

article:
insert fake commentary sentences in between article summary sentences...
'But we all know that's just not true.' 'Only someone ridiculous would say that.'

title:
inserts = prefix: 'revealed', 'WOW, you won't believe this.
identify major noun in article + action

changes = does to doesn't

swap nouns so action is done to subject

*/



/*

scraped/stats table:
domain varchar(40)
articleid foreign key
redditid varchar(40)



<meta property="og:title" content="European Travel Destinations">
<meta property="og:description" content="Offering tour packages for individuals or groups.">
<meta property="og:image" content="http://euro-travel-example.com/thumbnail.jpg">
<meta property="og:url" content="http://euro-travel-example.com/index.htm">

<meta name="twitter:title" content="European Travel Destinations ">
<meta name="twitter:description" content=" Offering tour packages for individuals or groups.">
<meta name="twitter:image" content=" http://euro-travel-example.com/thumbnail.jpg">
<meta name="twitter:card" content="summary_large_image">

<meta property="fb:app_id" content="your_app_id" />
<meta name="twitter:site" content="@website-username">


1. get subreddit top listings
2. find top link post
3. if data.id is already in DB, then skip to next top post
4. add data.title to dbObj
5. set link to SMMRY/lexrank - get back keywords and article body
6. scrape website for image according to meta property="og:" and name="twitter:", also get title, url, description. if no url, use original reddit URL
7. if no image found, send keywords to clarithai OR  for image based on keywords
*/

const https = require('https'),
      winston = require('../services/winston'),
      fs = require('fs'),
      request = require('request'),
      articleProcessor = require('./articleProcessor');

request('https://www.reddit.com/r/all/top/.json', (err, res, raw) => {
  let category = 'front';
  if (!err && res.statusCode == 200) {
    let body = JSON.parse(raw);
    // winston.log.info(body);
    articleProcessor.findPost(body, category);
  } else {
    winston.get.error(err);
  }
});



// // https.get the ol' fashioned way
// var file = 'test.json';
// https.get('https://www.reddit.com/r/politics/top.json', (res) => {
//   console.log('statusCode:', res.statusCode);
//   res.setEncoding('utf8');
//   let rawData = '';
//   res.on('data', (chunk) => rawData += chunk);
//   res.on('end', () => {
//     try {
//       let parsedData = JSON.parse(rawData);
//       let test = {};
//       test.timestamp = new Date().getTime();
//       test.data = parsedData.data.children;
//       let separator = ',\n\n';
//       fs.appendFile(file, separator + JSON.stringify(test, null, 2), function (err) {
//         if (err) return winston.get.error('writeError: ', err);
//         console.log('writing to ' + file);
//       });
//     } catch (e) {
//       winston.get.error(e.message);
//     }
//   });
// })
// .on('error', (e) => {
// winston.get.error(e.message);
// });

// get REDDIT local data
// var redditData = require('./test');
// for (let i = 0; i < redditData.length; i++) {
//   var posts = data[i].data;
//   for (let i = 0; i < posts.length; i++) {
//     console.log(i, ':', posts[i].data.score);
//   }
// }

// downloading images
// var fs = require('fs'),
//     request = require('request');
//
// var download = function(uri, filename, callback){
//   request.head(uri, function(err, res, body){
//     console.log('content-type:', res.headers['content-type']);
//     console.log('content-length:', res.headers['content-length']);
//
//     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
//   });
// };
//
// download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
//   console.log('done');
// });
