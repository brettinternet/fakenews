// BUSINESS
var testJson = 'test.json';
https.get('https://www.reddit.com/r/business/top.json', (res) => {
  console.log('statusCode:', res.statusCode);
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => rawData += chunk);
  res.on('end', () => {
    try {
      let parsedData = JSON.parse(rawData);
      let test = {};
      test.timestamp = new Date().getTime();
      test.data = parsedData.data.children;
      let separator = ',\n\n';
      fs.appendFile(testJson, separator + JSON.stringify(test, null, 2), function (err) {
        if (err) return console.log('writeError: ', err);
        console.log('writing to ' + testJson);
      });
    } catch (e) {
      logErr.error(e.message);
    }
  });
}).on('error', (e) => {
logErr.error(e.message);
});

// get REDDIT local data
// var redditData = require('./test');
// for (let i = 0; i < redditData.length; i++) {
//   var posts = data[i].data;
//   for (let i = 0; i < posts.length; i++) {
//     console.log(i, ':', posts[i].data.score);
//   }
// }
