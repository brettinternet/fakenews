const app = require('../index'),
      db = app.get('db'),
      winston = require('../services/winston');

module.exports = {

  create: function(req, response) {
    let inc = req.body;
    if (inc.createdat == null) {
      inc.createdat = new Date();
    }
    // if 2 authors per category
    db.run("SELECT id FROM authors WHERE categoryid = (SELECT id FROM categories WHERE upper(category) = upper($1)) OFFSET floor(random()*(2)) LIMIT 1", [inc.category], (err, res) => {
      if (err) winston.error.error(err);
      let authorid = res[0].id;
      db.run("SELECT	id FROM countries WHERE upper(twoletter) = upper($1)", [inc.country], (err, res) => {
        if (err) winston.error.error(err);
        let countryid = res[0].id;
        db.run("SELECT id FROM categories WHERE upper(category) = upper($1)", [inc.category], (err, res) => {
          if (err) winston.error.error(err);
          let categoryid = res[0].id;
          logger.info(req.body);
          let values = {
            published: inc.published,
            authorid: authorid,
            city: inc.city,
            state: inc.state,
            countryid: countryid,
            title: inc.title,
            img: inc.img,
            imgnail: inc.imgnail,
            imgdesc: inc.imgdesc,
            headline: inc.headline,
            content: inc.content,
            createdat: inc.createdat,
            categoryid: categoryid,
            breakingnews: inc.breakingnews,
            flag: inc.flag
          };
          db.articles.insert(values, (err, article) => {
            if (err) {
              winston.error.error(err);
              return response.status(500).send(err);
            }
            for (let i = 0; i < inc.tags.length; i++) {
              let tagsObj = {};
              tagsObj.tag = inc.tags[i];
              tagsObj.articleid = article.id;
              db.tags.insert(tagsObj, (err, res) => {
                if (err) {
                  winston.error.error(err);
                  return response.status(500).send(err);
                }
              });
            };
            response.status(204).send();
          });
        });
      });
    });
  },

  getId: function(req, response) {
    let articleObj = {};
    db.run("SELECT articles.*, array_agg(tags.tag) AS tags, countries.name AS countryname, countries.twoletter AS countrytwoletter FROM articles LEFT JOIN tags on tags.articleid = articles.id JOIN countries on countries.id = articles.countryid WHERE articles.id = $1 AND articles.published = true GROUP BY articles.id, countries.name, countries.twoletter", [req.params.articleId], (err, res) => {
      if (err) {
        console.log(err);
        winston.error.error(err);
        return response.status(500).send(err);
      }
      if (res.length >= 1) {
        articleObj.article = res[0];
        db.run("SELECT authors.firstname, authors.lastname, authors.email, categories.category FROM authors JOIN categories on categories.id = authors.categoryid WHERE authors.id = $1", [articleObj.article.authorid], (err, res) => {
          if (err) {
            winston.error.error(err);
            return response.status(500).send(err);
          }
          articleObj.author = res[0];
          response.status(200).send(articleObj);
        });
      } else {
        response.status(404).send();
      }
    });
  },

  // getFewIds: function(req, response) {
  //   req.field1
  //   db.run("", [req.params.category], (err, res) => {
  //     if (err) {
  //       winston.error.error(err);
  //       return response.status(500).send(err);
  //     }
  //     response.status(200).send(res);
  //   });
  // },

  getCat: function(req, response) {
    db.run("SELECT articles.*, categories.category, authors.firstname::text || ' ' || authors.lastname::text AS author FROM articles JOIN categories ON categories.id = articles.categoryid JOIN authors ON authors.id = articles.authorid WHERE articles.published = true AND upper(categories.category) = upper($1) ORDER BY createdat DESC LIMIT 10", [req.params.category], (err, res) => {
      if (err) {
        winston.error.error(err);
        return response.status(500).send(err);
      }
      response.status(200).send(res);
    });
  },

  getCatTags: function(req, response) {
    db.run("SELECT tags.tag, categories.category, count(tags.id) AS count FROM tags JOIN articles ON articles.id = tags.articleid JOIN categories ON categories.id = articles.categoryid WHERE articles.published = true AND categories.category = $1 GROUP BY tags.tag, categories.category", [req.params.category], (err, res) => {
      if (err) {
        winston.error.error(err);
        return response.status(500).send(err);
      }
      response.status(200).send(res);
    });
  },

  getArticlesByTag: function(req, response) {
    let tagTerm = '%' + req.params.tag + '%';
    db.run("SELECT articles.*, categories.category, authors.firstname::text || ' ' || authors.lastname::text AS author FROM articles JOIN categories ON categories.id = articles.categoryid JOIN authors ON authors.id = articles.authorid JOIN tags on tags.articleid = articles.id  WHERE articles.published = true AND tags.tag LIKE lower($1) GROUP BY articles.id, categories.category, authors.firstname, authors.lastname ORDER BY createdat DESC LIMIT 10", [tagTerm], (err, res) => {
      if (err) {
        winston.error.error(err);
        return response.status(500).send(err);
      }
      response.status(200).send(res);
    });
  },

  // TODO: Offset and paginate response
  searchTitle: function(req, response) {
    let searchTerm = '%' + req.query.title + '%';
    db.run("SELECT articles.*, categories.category, authors.firstname::text || ' ' || authors.lastname::text AS author, array_agg(tags.tag) AS tags FROM articles JOIN categories ON categories.id = articles.categoryid JOIN authors ON authors.id = articles.authorid LEFT JOIN tags on tags.articleid = articles.id  WHERE articles.published = true AND (upper(articles.title) LIKE upper($1) OR upper(articles.headline) LIKE upper($1)) GROUP BY articles.id, categories.category, authors.firstname, authors.lastname ORDER BY createdat DESC LIMIT 10", [searchTerm], (err, res) => {
      if (err) {
        winston.error.error(err);
        return response.status(500).send(err);
      }
      response.status(200).send(res);
    });
  },

  update: function(req, response) {
    let articleId = req.params.articleId;
    let inc = req.body;
    if (inc.createdat == null) {
      inc.createdat = new Date();
    }
    db.run("SELECT id FROM authors WHERE categoryid = (SELECT id FROM categories WHERE upper(category) = upper($1)) OFFSET floor(random()*(2)) LIMIT 1", [inc.category], (err, res) => {
      if (err) winston.error.error(err);
      let authorid = res[0].id;
      db.run("SELECT	id FROM countries WHERE upper(twoletter) = upper($1)", [inc.country], (err, res) => {
        if (err) winston.error.error(err);
        let countryid = res[0].id;
        db.run("SELECT id FROM categories WHERE upper(category) = upper($1)", [inc.category], (err, res) => {
          if (err) winston.error.error(err);
          let categoryid = res[0].id;
          let values = {
            id: articleId,
            published: inc.published,
            authorid: authorid,
            city: inc.city,
            state: inc.state,
            countryid: countryid,
            title: inc.title,
            img: inc.img,
            imgnail: inc.imgnail,
            imgdesc: inc.imgdesc,
            headline: inc.headline,
            content: inc.content,
            createdat: inc.createdat,
            categoryid: categoryid,
            breakingnews: inc.breakingnews,
            flag: inc.flag
          };
          db.articles.update(values, (err, article) => {
            if (err) {
              winston.error.error(err);
              return response.status(500).send(err);
            }
            db.tags.destroy({articleid: articleId}, (err, res) => {
              if (err) winston.error.error(err);
              for (let i = 0; i < inc.tags.length; i++) {
                let tagsObj = {};
                tagsObj.tag = inc.tags[i];
                tagsObj.articleid = articleId;
                db.tags.insert(tagsObj, (err, res) => {
                  if (err) return response.status(500).send(err);
                });
              };
              response.status(204).send();
            });
          });
        });
      });
    });
  },

  delete: function(req, response) {
    let articleId = req.params.articleId;
    db.articles.destroy({id: articleId}, (err, res) => {
      if (err) {
        winston.error.error(err);
        return response.status(500).send(err);
      }
      response.status(204).send();
    });
  }

}
