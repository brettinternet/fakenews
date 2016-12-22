const express = require('express'),
      bodyParser = require('body-parser'),
      massive = require('massive'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      config = require('./config'),
      cors = require('cors'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      winston = require('./services/winston'),
      https = require('https'),
      // redditCtrl = require('./controllers/redditCtrl')
      FacebookStrategy = require('passport-facebook').Strategy;


const app = module.exports = express();
var port = 57000;
var corsOptions = {
  origin: '*',
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
// app.use(cookieParser());
// app.use(session({
//   secret: config.sessionSecret,
//   saveUninitialized: false,
//   resave: true
// }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(express.static(__dirname + '/public'));

app.listen(3000, function() {
  console.log('Connected on 3000')
});


//////////////
// DATABASE //
//////////////
const massiveInstance = massive.connectSync({
  connectionString: config.connectionString
})

app.set('db', massiveInstance);
const db = app.get('db');
const articleCtrl = require('./controllers/articleCtrl');

app.get('/api/search', articleCtrl.searchTitle);
app.get('/api/:category', articleCtrl.getCat);
app.get('/api/tags/:category', articleCtrl.getCatTags);
app.get('/api/article/:articleId', articleCtrl.getId);
app.get('/api/tag/:tag', articleCtrl.getArticlesByTag);
// app.get('/api/articles', articleCtrl.getFewIds);
app.put('/api/article/:articleId', articleCtrl.update);
app.post('/api/article', articleCtrl.create);
app.delete('/api/article/:articleId', articleCtrl.delete);









//
