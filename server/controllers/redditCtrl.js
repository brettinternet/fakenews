// const https = require('https'),
//       winston = require('../services/winston'),
//       fs = require('fs'),
//       request = require('request'),
//       articleProcessor = require('./articleProcessor');
//
//
// request('https://www.reddit.com/r/news/top/.json', (err, res, raw) => {
//   let category = 'front';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// // request('https://www.reddit.com/r/pics/top/.json', (err, res, raw) => {
// //   let category = 'front';
// //   if (!err && res.statusCode == 200) {
// //     let body = JSON.parse(raw);
// //     picsProcessor.findPost(body, category);
// //   } else {
// //     winston.get.error(err);
// //   }
// // });
//
// request('https://www.reddit.com/r/business/top/.json', (err, res, raw) => {
//   let category = 'business';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/economy/top/.json', (err, res, raw) => {
//   let category = 'economy';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/politics/top/.json', (err, res, raw) => {
//   let category = 'politics';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/business/top/.json', (err, res, raw) => {
//   let category = 'business';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/science/top/.json', (err, res, raw) => {
//   let category = 'science';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// // request('https://www.reddit.com/r/shittyaskscience/top/.json', (err, res, raw) => {
// //   let category = 'science';
// //   if (!err && res.statusCode == 200) {
// //     let body = JSON.parse(raw);
// //     articleProcessor.findPost(body, category);
// //   } else {
// //     winston.get.error(err);
// //   }
// // });
//
// request('https://www.reddit.com/r/fitness/top/.json', (err, res, raw) => {
//   let category = 'health';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// // request('https://www.reddit.com/r/mealprepsunday/top/.json', (err, res, raw) => {
// //   let category = 'health';
// //   if (!err && res.statusCode == 200) {
// //     let body = JSON.parse(raw);
// //     picProcessor.findPost(body, category);
// //   } else {
// //     winston.get.error(err);
// //   }
// // });
//
// request('https://www.reddit.com/r/futurology/top/.json', (err, res, raw) => {
//   let category = 'tech';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/gadgets/top/.json', (err, res, raw) => {
//   let category = 'tech';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/sports/top/.json', (err, res, raw) => {
//   let category = 'sports';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/upliftingnews/top/.json', (err, res, raw) => {
//   let category = 'lifestyle';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/entertainment/top/.json', (err, res, raw) => {
//   let category = 'entertainment';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/worldnews/top/.json', (err, res, raw) => {
//   let category = 'world';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/philosophy/top/.json', (err, res, raw) => {
//   let category = 'opinion';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
// request('https://www.reddit.com/r/inthenews/top/.json', (err, res, raw) => {
//   let category = 'opinion';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     articleProcessor.findPost(body, category);
//   } else {
//     winston.get.error(err);
//   }
// });
//
//
//
//
// // // https.get the ol' fashioned way
// // var file = 'test.json';
// // https.get('https://www.reddit.com/r/politics/top.json', (res) => {
// //   console.log('statusCode:', res.statusCode);
// //   res.setEncoding('utf8');
// //   let rawData = '';
// //   res.on('data', (chunk) => rawData += chunk);
// //   res.on('end', () => {
// //     try {
// //       let parsedData = JSON.parse(rawData);
// //       let test = {};
// //       test.timestamp = new Date().getTime();
// //       test.data = parsedData.data.children;
// //       let separator = ',\n\n';
// //       fs.appendFile(file, separator + JSON.stringify(test, null, 2), function (err) {
// //         if (err) return winston.get.error('writeError: ', err);
// //         console.log('writing to ' + file);
// //       });
// //     } catch (e) {
// //       winston.get.error(e.message);
// //     }
// //   });
// // })
// // .on('error', (e) => {
// // winston.get.error(e.message);
// // });
//
// // get REDDIT local data
// // var redditData = require('./test');
// // for (let i = 0; i < redditData.length; i++) {
// //   var posts = data[i].data;
// //   for (let i = 0; i < posts.length; i++) {
// //     console.log(i, ':', posts[i].data.score);
// //   }
// // }
//
// // downloading images
// // var fs = require('fs'),
// //     request = require('request');
// //
// // var download = function(uri, filename, callback){
// //   request.head(uri, function(err, res, body){
// //     console.log('content-type:', res.headers['content-type']);
// //     console.log('content-length:', res.headers['content-length']);
// //
// //     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
// //   });
// // };
// //
// // download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
// //   console.log('done');
// // });
