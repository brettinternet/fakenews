const express = require('express'),
      bodyParser = require('body-parser'),
      cors = require('cors'),
      massive = require('massive'),
      passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      config = require('./config'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      winston = require('./services/winston'),
      FacebookStrategy = require('passport-facebook').Strategy;


const app = module.exports = express();
app.use(express.static('public'));
// app.use(express.static(__dirname + '../public'));

// var corsOptions = {
//   origin: 'http://127.0.0.1:3000'
// };
// app.use(cors(corsOptions));
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: false,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

//////////////
// DATABASE //
//////////////
const massiveInstance = massive.connectSync({
  connectionString: config.connectionString
})

app.set('db', massiveInstance);
const db = app.get('db');
const articleCtrl = require('./controllers/articleCtrl'),
      articleProcessor = require('./controllers/articleProcessor'),
      redditCtrl = require('./controllers/redditCtrl');


app.get('/api/search', articleCtrl.searchTitle);
app.get('/api/:category', articleCtrl.getCat);
app.get('/api/tags/:category', articleCtrl.getCatTags);
app.get('/api/article/:articleId', articleCtrl.getId);
app.get('/api/tag/:tag', articleCtrl.getArticlesByTag);
// app.get('/api/articles', articleCtrl.getFewIds);
app.put('/api/article/:articleId', articleCtrl.update);
app.post('/api/article', articleCtrl.create);
app.delete('/api/article/:articleId', articleCtrl.delete);







app.listen(3000, function() {
  console.log('Connected on 3000')
});
