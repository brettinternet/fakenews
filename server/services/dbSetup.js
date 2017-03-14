const massive = require('massive'),
      app = require('../index'),
      config = require('../config'),
      countries = require('./data/countries'),
      users = require('./data/users'),
      authors = require('./data/authors');


const runDBSetup = () => {
  try {
    let dbSetup = massive.connectSync({
      connectionString: config.connectionString
    });
    let categories = [
      'business',
      'tech',
      'economy',
      'politics',
      'science',
      'health',
      'sports',
      'lifestyle',
      'entertainment',
      'world',
      'opinion',
      'front'
    ];
    dbSetup.run("CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY not null, category VARCHAR(40) not null)", (err, res) => {
      if (err)
        console.error('Could not create/load Postgres table "categories".', err);
      else
        categories.forEach(el => {
          dbSetup.categories.insert(el, (err, response) => {
            if (err) console.error(err);
          }
        }
    });

    dbSetup.run("CREATE TABLE IF NOT EXISTS countries (id SERIAL PRIMARY KEY not null, name VARCHAR(100) not null, twoletter VARCHAR(2) not null, searchterms VARCHAR(100))", (err, res) => {
      if (err) console.error('Could not create/load Postgres table "countries".', err);
      dbSetup.users.find({id: 1}, (err, checkCountry) => {
        if (err) console.error(err);
        if (checkCountry.length === 0) {
          console.console.log(`No countries in DB. Adding countries...`);
          countries.data.forEach(country => {
            dbSetup.countries.insert({name: country[0], twoletter: country[1], searchterms: country[2]}, (err, response) => {
              if (err) console.error(err);
            }
          });
        }
      }
    });

    dbSetup.run("CREATE TABLE IF NOT EXISTS authors (id SERIAL PRIMARY KEY not null, FirstName VARCHAR(40) not null, LastName VARCHAR(40) not null, username VARCHAR(40) not null, Email VARCHAR(100) not null, City VARCHAR(100), State VARCHAR(100), countryid INTEGER REFERENCES countries(id), Img VARCHAR(500), ImgNail VARCHAR(500), CategoryId INTEGER REFERENCES categories(id), createdAt TIMESTAMP)", (err, res) => {
      if (err) console.error('Could not create/load Postgres table "authors".', err);
      dbSetup.authors.find({id: 1}, (err, checkAuthor) => {
        if (err) console.err(err);
        if (checkAuthor.length === 0) {
          console.log(`No users in DB. Adding authors...`);
          authors.data.forEach(author => {
            dbSetup.countries.find({twoletter: author[8]}, (err, _countries) => {
              if (err) console.error(`Could not get author "${author[3]}" countryID. ${err}`);
              dbSetup.users.insert({
                firstname: author[0],
                lastname: author[1],
                username: author[2],
                email: author[3],
                city: author[4],
                state: author[5],
                img: author[6],
                imgnail: author[7],
                registered: author[9],
                countryid: _countries[0],
                categoryid: author[10]
              }, (err, response) => {
                if (err) console.error(err);
              }
            });
          });
        }
      });
    });

    dbSetup.run("CREATE TABLE IF NOT EXISTS articles (id SERIAL PRIMARY KEY not null, Published BOOLEAN, AuthorId INTEGER REFERENCES authors(id) not null, City VARCHAR(100), State VARCHAR(100), countryid INTEGER REFERENCES countries(id), Title VARCHAR(500) not null, Img VARCHAR(1000), ImgNail VARCHAR(1000), ImgDesc VARCHAR(1000), Headline VARCHAR(1000), body TEXT, createdAt TIMESTAMP, CategoryId INTEGER REFERENCES Categories(id) not null, BreakingNews BOOLEAN not null, origin VARCHAR(2000), picpost BOOLEAN, lat NUMERIC, long NUMERIC)", (err, res) => {
      if (err) console.error('Could not create/load Postgres table "articles".', err);
    });

    dbSetup.run("CREATE TABLE IF NOT EXISTS tags (id SERIAL PRIMARY KEY not null, tag VARCHAR(40) not null, articleid INTEGER REFERENCES articles(id))", (err, res) => {
      if (err) console.error('Could not create/load Postgres table "tags".', err);
    });

    dbSetup.run("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY not null, FirstName VARCHAR(40) not null, LastName VARCHAR(40) not null, username VARCHAR(40) not null, Email VARCHAR(100) not null, City VARCHAR(100), State VARCHAR(100), countryid INTEGER REFERENCES countries(id), Img VARCHAR(500), ImgNail VARCHAR(500), registered TIMESTAMP)", (err, res) => {
      if (err) console.error('Could not create/load Postgres table "users".', err);
      dbSetup.users.find({id: 1}, (err, checkUser) => {
        if (err) console.err(err);
        if (checkUser.length === 0) {
          console.log(`No users in DB. Adding users...`);
          users.data.forEach(user => {
            dbSetup.countries.find({twoletter: user[8]}, (err, __countries) => {
              if (err) console.error(`Could not get user "${user[3]}" countryID. ${err}`);
              dbSetup.users.insert({
                firstname: user[0],
                lastname: user[1],
                username: user[2],
                email: user[3],
                city: user[4],
                state: user[5],
                img: user[6],
                imgnail: user[7],
                registered: user[9],
                countryid: __countries[0]
              }, (err, response) => {
                if (err) console.error(err);
              }
            });
          });
        }
      });
    });

    dbSetup.run("CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY not null, Comment VARCHAR(500) not null, UserId INTEGER REFERENCES users(id) not null, ParentId INTEGER, ArticleId INTEGER REFERENCES articles(id) not null, createdAt TIMESTAMP, redditid VARCHAR(40))", (err, res) => {
      if (err) console.error('Could not create/load Postgres table "comments".', err);
    });

    dbSetup.run("CREATE TABLE IF NOT EXISTS scraped (id SERIAL PRIMARY KEY not null, redditid VARCHAR(40) not null, domain VARCHAR(40), score INTEGER, redditurl VARCHAR(500), mediatype VARCHAR(40), reddittitle VARCHAR(500), fulltext TEXT, articleid INTEGER REFERENCES articles(id))", (err, res) => {
      if (err) console.error('Could not create/load Postgres table "scraped".', err);
    });

  } catch (err) {
    console.error('ERROR: unable to initialize the PostgreSQL database.', err);
  }
}

exports.runDBSetup = runDBSetup;
