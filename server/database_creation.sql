CREATE DATABASE realnews;

CREATE TABLE categories
(
  id SERIAL PRIMARY KEY not null,
  Category VARCHAR(40) not null
);

INSERT INTO categories (category) VALUES ('business'),
('tech'),
('economy'),
('politics'),
('science'),
('health'),
('sports'),
('lifestyle'),
('entertainment'),
('world'),
('opinion'),
('front');

-- ########################################################
-- ########################################################
-- ########################################################

CREATE TABLE tags
(
  id SERIAL PRIMARY KEY not null,
  tag VARCHAR(40) not null,
  articleid INTEGER REFERENCES articles(id)
);

INSERT INTO tags (tag, articleid) VALUES ('wow', 1)

-- ########################################################
-- ########################################################
-- ########################################################

CREATE TABLE scraped
(
  id SERIAL PRIMARY KEY not null,
  redditid VARCHAR(40) not null,
  domain VARCHAR(40),
  score INTEGER,
  redditurl VARCHAR(500),
  mediatype VARCHAR(40),
  linktitle VARCHAR(500),
  fulltext TEXT,
  articleid INTEGER REFERENCES articles(id)
);

INSERT INTO scraped (redditid, domain, articleid) VALUES ()

-- ########################################################
-- ########################################################
-- ########################################################

CREATE TABLE authors
(
  id SERIAL PRIMARY KEY not null,
  FirstName VARCHAR(40) not null,
  LastName VARCHAR(40) not null,
  username VARCHAR(40) not null,
  Email VARCHAR(100) not null,
  City VARCHAR(100),
  State VARCHAR(100),
  Country VARCHAR(100),
  Img VARCHAR(500),
  ImgNail VARCHAR(500),
  CategoryId INTEGER REFERENCES categories(id),
  createdAt TIMESTAMP WITH TIME ZONE
);

INSERT INTO authors (name, email, img, imgnail, categoryid, createdat) VALUES ('');

-- ########################################################
-- ########################################################
-- ########################################################

CREATE TABLE articles
(
  id SERIAL PRIMARY KEY not null,
  Published BOOLEAN,
  AuthorId INTEGER REFERENCES authors(id) not null,
  City VARCHAR(100),
  State VARCHAR(100),
  Country VARCHAR(100),
  Title VARCHAR(500) not null,
  Img VARCHAR(1000),
  ImgNail VARCHAR(1000),
  ImgDesc VARCHAR(1000),
  Headline VARCHAR(1000),
  body TEXT,
  createdAt TIMESTAMP WITH TIME ZONE,
  CategoryId INTEGER REFERENCES Categories(id) not null,
  BreakingNews BOOLEAN not null,
  flag BOOLEAN not null
);

INSERT INTO articles (published, authorid, city, state, country, title, img, imgnail, imgdesc, headline, content, createdat, categoryid, breakingnews) VALUES ('');

-- ########################################################
-- ########################################################
-- ########################################################

CREATE TABLE users
(
  id SERIAL PRIMARY KEY not null,
  FirstName VARCHAR(40) not null,
  LastName VARCHAR(40) not null,
  username VARCHAR(40) not null,
  Email VARCHAR(100) not null,
  City VARCHAR(100),
  State VARCHAR(100),
  Country VARCHAR(100) not null,
  Img VARCHAR(500),
  ImgNail VARCHAR(500),
  registered TIMESTAMP WITH TIME ZONE
);

INSERT INTO users (firstname, lastname, email, city, state, country, img, imgnail, categoryid, registered) VALUES ('');

-- ########################################################
-- ########################################################
-- ########################################################

CREATE TABLE comments
(
  id SERIAL PRIMARY KEY not null,
  Comment VARCHAR(500) not null,
  UserId INTEGER REFERENCES users(id) not null,
  ParentId INTEGER,
  ArticleId INTEGER REFERENCES articles(id) not null,
  createdAt TIMESTAMP WITH TIME ZONE,
  redditid VARCHAR(40),
  -- source VARCHAR(40)
);

INSERT INTO comments (comment, userid, parentid, articleid, createdat, redditid) VALUES ('');

-- ########################################################
-- ########################################################
-- ########################################################

CREATE TABLE countries (
  id SERIAL PRIMARY KEY not null,
  name VARCHAR(100) not null,
  twoletter VARCHAR(2) not null,
  search VARCHAR(100) not null
);

ALTER TABLE authors ALTER COLUMN countryid TYPE integer USING (countryid::integer);

ALTER SEQUENCE authors_id_seq RESTART WITH 1492;

-- ########################################################
-- ########################################################
-- ########################################################
