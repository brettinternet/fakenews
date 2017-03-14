const massive = require('massive'),
      app = require('../index'),
      colors = require('colors'),
      config = require('../config'),
      countries = require('./data/countries'),
      users = require('./data/users'),
      authors = require('./data/authors');

const insertData = () => {
  let dataSetup = massive.connectSync({
    connectionString: config.connectionString
  });

  let setCategories = new Promise((resolve, reject) => {
    let categories = ['business', 'tech', 'economy', 'politics', 'science', 'health', 'sports', 'lifestyle', 'entertainment', 'world', 'opinion', 'front'];
    dataSetup.categories.find({id: 1}, (err, checkCategory) => {
      if (err) console.error(err);
      if (checkCategory.length === 0) {
        console.log(`No categories in DB. Adding countries...`.dim);
        categories.forEach((el, i) => {
          dataSetup.categories.insert({category: el}, (err, response) => {
            if (err) console.error(err);
            if (i === categories.length-1) resolve(`categories setup`);
          });
        });
      }
    });
  });

  let setCountries = new Promise((resolve, reject) => {
    dataSetup.countries.find({id: 1}, (err, checkCountry) => {
      if (err) console.error(err);
      if (checkCountry.length === 0) {
        console.log(`No countries in DB. Adding countries...`.dim);
        countries.data.forEach((country, i) => {
          dataSetup.countries.insert({name: country[0], twoletter: country[1], searchterms: country[2]}, (err, response) => {
            if (err) console.error(err);
            if (i === countries.data.length-1) resolve(`countries setup`);
          });
        });
      }
    });
  });

  Promise.all([setCategories, setCountries]).then(continueSetup => {

    dataSetup.authors.find({id: 1}, (err, checkAuthor) => {
      if (err) console.err(err);
      if (checkAuthor.length === 0) {
        console.log(`No authors in DB. Adding authors...`.dim);
        authors.data.forEach((author) => {
          dataSetup.countries.find({twoletter: author[8]}, (err, _countries) => {
            if (err) console.error(`Could not get author "${author[3]}" countryID. ${err}`.red);
            let countryid = _countries.length > 0 ? _countries[0].id : null;
            dataSetup.authors.insert({
              firstname: author[0],
              lastname: author[1],
              username: author[2],
              email: author[3],
              city: author[4],
              state: author[5],
              img: author[6],
              imgnail: author[7],
              registered: author[9],
              countryid,
              categoryid: author[10]
            }, (err, response) => {
              if (err) console.error(err);
            });
          });
        });
      }
    });

    dataSetup.users.find({id: 1}, (err, checkUser) => {
      if (err) console.err(err);
      if (checkUser.length === 0) {
        console.log(`No users in DB. Adding users...`.dim);
        users.data.forEach((user) => {
          dataSetup.countries.find({twoletter: user[8]}, (err, __countries) => {
            if (err) console.error(`Could not get user "${user[3]}" countryID. ${err}`.red);
            let countryid = __countries.length > 0 ? __countries[0].id : null;
            dataSetup.users.insert({
              firstname: user[0],
              lastname: user[1],
              username: user[2],
              email: user[3],
              city: user[4],
              state: user[5],
              img: user[6],
              imgnail: user[7],
              registered: user[9],
              countryid
            }, (err, response) => {
              if (err) console.error(err);
            });
          });
        });
      }
    });

  })
  .catch(err => console.error(err));
}

const createTables = () => {
  let dbSetup = massive.connectSync({
    connectionString: config.connectionString
  });

  dbSetup.run("CREATE TABLE IF NOT EXISTS categories (id SERIAL PRIMARY KEY not null, category VARCHAR(40) not null)", (err, res) => {
    if (err) console.error('Could not create/load Postgres table "categories".'.red, err);
  });

  dbSetup.run("CREATE TABLE IF NOT EXISTS countries (id SERIAL PRIMARY KEY not null, name VARCHAR(100) not null, twoletter VARCHAR(2) not null, searchterms VARCHAR(100))", (err, res) => {
    if (err) console.error('Could not create/load Postgres table "countries".'.red, err);

    dbSetup.run("CREATE TABLE IF NOT EXISTS authors (id SERIAL PRIMARY KEY not null, FirstName VARCHAR(40) not null, LastName VARCHAR(40) not null, username VARCHAR(40), Email VARCHAR(100), City VARCHAR(100), State VARCHAR(100), countryid INTEGER REFERENCES countries(id), Img VARCHAR(500), ImgNail VARCHAR(500), CategoryId INTEGER REFERENCES categories(id) not null, registered TIMESTAMP DEFAULT NOW())", (err, res) => {
      if (err) console.error('Could not create/load Postgres table "authors".'.red, err);

      dbSetup.run("CREATE TABLE IF NOT EXISTS articles (id SERIAL PRIMARY KEY not null, Published BOOLEAN, AuthorId INTEGER REFERENCES authors(id), City VARCHAR(100), State VARCHAR(100), countryid INTEGER REFERENCES countries(id), Title VARCHAR(500) not null, Img VARCHAR(1000), ImgNail VARCHAR(1000), ImgDesc VARCHAR(1000), Headline VARCHAR(1000), body TEXT, createdAt TIMESTAMP DEFAULT NOW(), CategoryId INTEGER REFERENCES Categories(id) not null, BreakingNews BOOLEAN, origin VARCHAR(2000), picpost BOOLEAN, lat NUMERIC, long NUMERIC)", (err, res) => {
        if (err) console.error('Could not create/load Postgres table "articles".'.red, err);

        dbSetup.run("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY not null, FirstName VARCHAR(40) not null, LastName VARCHAR(40) not null, username VARCHAR(40) not null, Email VARCHAR(100) not null, City VARCHAR(100), State VARCHAR(100), countryid INTEGER REFERENCES countries(id), Img VARCHAR(500), ImgNail VARCHAR(500), registered TIMESTAMP DEFAULT NOW())", (err, res) => {
          if (err) console.error('Could not create/load Postgres table "users".'.red, err);

          dbSetup.run("CREATE TABLE IF NOT EXISTS tags (id SERIAL PRIMARY KEY not null, tag VARCHAR(40) not null, articleid INTEGER REFERENCES articles(id))", (err, res) => {
            if (err) console.error('Could not create/load Postgres table "tags".'.red, err);
          });

          dbSetup.run("CREATE TABLE IF NOT EXISTS comments (id SERIAL PRIMARY KEY not null, Comment VARCHAR(500) not null, UserId INTEGER REFERENCES users(id) not null, ParentId INTEGER, ArticleId INTEGER REFERENCES articles(id) not null, createdAt TIMESTAMP DEFAULT NOW(), redditid VARCHAR(40))", (err, res) => {
            if (err) console.error('Could not create/load Postgres table "comments".'.red, err);
          });

          dbSetup.run("CREATE TABLE IF NOT EXISTS scraped (id SERIAL PRIMARY KEY not null, redditid VARCHAR(40), domain VARCHAR(40), score INTEGER, redditurl VARCHAR(500), mediatype VARCHAR(40), reddittitle VARCHAR(500), fulltext TEXT, articleid INTEGER REFERENCES articles(id))", (err, res) => {
            if (err) console.error('Could not create/load Postgres table "scraped".'.red, err);
          });

          insertData();

        });
      });
    });
  });
}

exports.createTables = createTables;
