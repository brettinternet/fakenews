const winston = require('../services/winston'),
      request = require('request'),
      app = require('../index'),
      schedule = require('node-schedule'),
      pos = require('pos'),
      commentSrv = require('../services/commentSrv'),
      db = app.get('db');

// Cron job time format
// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

let ysk = new schedule.RecurrenceRule();
ysk.minute = 10; // hh:10 hourly

schedule.scheduleJob('*/45 * * * *', () => {
  request('https://www.reddit.com/r/showerthoughts/top/.json', (err, res, raw) => {
    let source = 'shower';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      commentProcessor(body, source);
    } else {
      winston.get.error(err);
    }
  });
});
// ysk
schedule.scheduleJob('* */2 * * *', () => {
  request('https://www.reddit.com/r/youshouldknow/top/.json', (err, res, raw) => {
    let source = 'ysk';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      commentProcessor(body, source);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob('*/40 * * * *', () => {
  request('https://www.reddit.com/r/todayilearned/top/.json', (err, res, raw) => {
    let source = 'til';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      commentProcessor(body, source);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob('*/50 * * * *', () => {
  request('https://www.reddit.com/r/NoStupidQuestions/top/.json', (err, res, raw) => {
    let source = 'stupidq';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      commentProcessor(body, source);
    } else {
      winston.get.error(err);
    }
  });
});

schedule.scheduleJob('*/55 * * * *', () => {
  request('https://www.reddit.com/r/shittyaskscience/top/.json', (err, res, raw) => {
    let source = 'scienceq';
    if (!err && res.statusCode == 200) {
      let body = JSON.parse(raw);
      commentProcessor(body, source);
    } else {
      winston.get.error(err);
    }
  });
});

commentProcessor = (body, source) => {
  let allComments = body.data.children,
      uniqueComment = [];
  function checkComment(comments, i) {
    if (comments[i]) {
      let redditid = comments[i].data.id;
      db.run("SELECT id FROM comments WHERE lower(redditid) = lower($1) AND id in (SELECT id FROM comments ORDER BY createdat DESC LIMIT 40)", [redditid], (err, res) => {
        if (err) winston.process.error(err);
        if (res.length >= 1) {
          i++;
          checkComment(allComments, i);
        } else {
          processComment(allComments[i], source, redditid);
          return true;
        };
      });
    } else {
      let redditid = allComments[0].data.id;
      processComment(allComments[0], source, redditid);
    }
  }
  checkComment(allComments, 0);
}

processComment = (comment, source, redditid) => {
  console.log(`processing comment ${source}`);
  let arrFix = [],
      text = comment.data.title,
      str = '',
      removed = [];
  if (source.toLowerCase() == 'ysk' || source.toLowerCase() == 'til') {
    arrFix = text.split(' ');
    removed = arrFix.splice(0,1);
    if (arrFix[0].toLowerCase() == 'that') {
      removed = arrFix.splice(0,1);
    }
    str = arrFix.join(' ');
  } else {
    str = text;
  }
  // TODO: If first word is proper noun, then keep capitalized
  if (str.charAt(0) == str.charAt(0).toUpperCase() && !(str.charAt(0) + str.charAt(1)).match(/I\s/)) {
    str = str.charAt(0).toLowerCase() + str.slice(1);
  }
  checkPos = (str) => {
    let words = new pos.Lexer().lex(str),
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
    if (arr[0].tag === 'NNP' || arr[0].tag === 'NNPS') {
      console.log('NNP BEFORE: ', str);
      str = str.charAt(0).toUpperCase() + str.slice(1);
      console.log('NNP AFTER: ',str);
    }
    saveComment(str, redditid);
  }
  checkPos(str)
}

saveComment = (str, redditid) => {
  rollDice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  db.run("SELECT id FROM users LIMIT 1 OFFSET floor(random()*(SELECT count(*) FROM users))", (err, res) => {
    if (err) winston.process.error(err);
    let userid = res[0].id;
    db.run("SELECT id FROM articles ORDER BY createdat DESC LIMIT 12", (err, res) => {
      if (err) winston.process.error(err);
      if (res.length === 0) return;
      let articleid = res[Math.floor(Math.random() * res.length)].id;
      let roll1 = rollDice(1, 10);
      console.log('commenting on articleID: ', articleid);
      if (roll1 > 7) {
        db.run("SELECT comments.id, users.firstname FROM comments JOIN articles ON articles.id = comments.articleid JOIN users ON users.id = comments.userid WHERE articles.id = $1 LIMIT 1 OFFSET floor(random()*(SELECT count(*) FROM comments JOIN articles ON articles.id = comments.articleid WHERE articles.id = $1))", [articleid], (err, response) => {
          if (err) winston.process.error(err);
          let fullComment = '';
          if (response.length > 0) {
            var parentid = response[0].id,
                author = response[0].firstname;
            author = author.charAt(0).toUpperCase() + author.slice(1);
            fullComment = commentSrv.concatComment(str, author);
          } else {
            var parentid = null;
            fullComment = commentSrv.concatComment(str, '');
          }
          db.run("INSERT INTO comments (comment, userid, parentid, articleid, redditid) VALUES ($1, $2, $3, $4, $5)", [fullComment, userid, parentid, articleid, redditid], (err, res) => {
            if (err) winston.process.error(err);
          });
        });
      } else {
        db.run("SELECT authors.firstname FROM authors JOIN articles ON articles.authorid = authors.id WHERE articles.id = $1", [articleid], (err, response) => {
          if (err) winston.process.error(err);
          let fullComment = '';
          if (response.length > 0) {
            var author = response[0].firstname;
            author = author.charAt(0).toUpperCase() + author.slice(1);
            fullComment = commentSrv.concatComment(str, author);
          } else {
            fullComment = commentSrv.concatComment(str, '');
          }
          db.run("INSERT INTO comments (comment, userid, articleid, redditid) VALUES ($1, $2, $3, $4)", [fullComment, userid, articleid, redditid], (err, res) => {
            if (err) winston.process.error(err);
          });
        });
      };
    });
  });
}
