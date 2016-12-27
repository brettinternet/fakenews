const winston = require('../services/winston'),
      request = require('request'),
      app = require('../index'),
      db = app.get('db');

concatComment = () => {
  salutations = [
    'umm hi ',
    'haha ok ',
    'Listen ',
    'Whatever '
  ];
  return salutations[Math.floor(Math.random() * salutations.length)]
}

// request('https://www.reddit.com/r/showerthoughts/top/.json', (err, res, raw) => {
//   let source = 'shower';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     commentProcessor(body, source);
//   } else {
//     winston.get.error(err);
//   }
// });
// request('https://www.reddit.com/r/youshouldknow/top/.json', (err, res, raw) => {
//   let source = 'ysk';
//   if (!err && res.statusCode == 200) {
//     let body = JSON.parse(raw);
//     commentProcessor(body, source);
//   } else {
//     winston.get.error(err);
//   }
// });

request('https://www.reddit.com/r/todayilearned/top/.json', (err, res, raw) => {
  let source = 'til';
  if (!err && res.statusCode == 200) {
    let body = JSON.parse(raw);
    commentProcessor(body, source);
  } else {
    winston.get.error(err);
  }
});

commentProcessor = (body, source) => {
  let allComments = body.data.children,
      uniqueComment = [];
  function checkComment(comments, i) {
    let redditid = comments[i].data.id;
    db.run("SELECT comments.id FROM comments WHERE lower(redditid) = lower($1)", [redditid], (err, res) => {
      // how to handle if all 25 (or less) currently in DB
      if (err) winston.process.error(err);
      if (res.length >= 1) {
        console.log('Skipping duplicate');
        i++;
        checkComment(allComments, i);
      } else {
        console.log('Found a comment');
        uniqueComment.push(allComments[i]);
        processComment(uniqueComment[0], source, redditid);
        return true;
      };
    });
  }
  checkComment(allComments, 0);
}

processComment = (comment, source, redditid) => {
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
  if (str.charAt(0) == str.charAt(0).toUpperCase() && !(str.charAt(0).match('/I/'))) {
    str = str.charAt(0).toLowerCase() + str.slice(1);
  }
  saveComment(str, redditid);
}

saveComment = (str, redditid) => {
  winston.log.info('comment: ', str)
  rollDice = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  db.run("SELECT id FROM users LIMIT 1 OFFSET floor(random()*(SELECT count(*) FROM users))", (err, res) => {
    if (err) winston.process.error(err);
    let userid = res[0].id;
    db.run("SELECT id FROM articles ORDER BY createdat DESC LIMIT 12", (err, res) => {
      if (err) winston.process.error(err);
      let articleid = res[Math.floor(Math.random() * res.length)].id;
      let roll1 = rollDice(1, 10);
      console.log('ID: ', articleid);
      if (roll1 >= 1) {
        db.run("SELECT comments.id, users.firstname FROM comments JOIN articles ON articles.id = comments.articleid JOIN users ON users.id = comments.userid WHERE articles.id = $1 LIMIT 1 OFFSET floor(random()*(SELECT count(*) FROM comments JOIN articles ON articles.id = comments.articleid WHERE articles.id = $1))", [articleid], (err, response) => {
          if (err) winston.process.error(err);
          let roll2 = rollDice(1, 10),
              fullComment = '';
          console.log(response);
          if (response.length > 0) {
            var parentid = response[0].id,
                author = response[0].firstname;
            author = author.charAt(0).toUpperCase() + author.slice(1);
            if (roll2 >= 1) {
                  // TODO: invoke str in newSalutation() for added customization
              let randomHello = concatComment();
              fullComment = randomHello + author + ' ' + str;
            } else {
              fullComment = str;
            }
          } else {
            var parentid = null;
            if (roll2 >= 1) {
              let randomHello = concatComment();
              fullComment = randomHello + str;
            } else {
              fullComment = str;
            }
          }
          db.run("INSERT INTO comments (comment, userid, parentid, articleid, redditid) VALUES ($1, $2, $3, $4, $5)", [fullComment, userid, parentid, articleid, redditid], (err, res) => {
            if (err) winston.process.error(err);
          });
        });
      } else {
        db.run("SELECT authors.firstname FROM authors JOIN articles ON articles.authorid = authors.id WHERE articles.id = $1", [articleid], (err, res) => {
          if (err) winston.process.error(err);
          let author = res[0],
              roll2 = rollDice(1, 10),
              fullComment = '';
          author = author.charAt(0).toUpperCase() + author.slice(1);
          if (roll2 > 6) {
            let randomHello = concatComment();
            fullComment = randomHello + author + ' ' + str;
          } else {
            fullComment = str;
          }
          db.run("INSERT INTO comments (comment, userid, articleid, redditid) VALUES ($1, $2, $3, $4)", [fullComment, userid, articleid, redditid], (err, res) => {
            if (err) winston.process.error(err);
          });
        });
      };
    });
  });
}
