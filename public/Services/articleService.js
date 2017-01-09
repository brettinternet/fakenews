angular.module('newsApp').service('articleService', function($http) {

  let server = 'http://news.brettgardiner.me',
      port = '';

  this.getArticles = (category) => {
    return $http.get(server+port+'/api/category/' + category)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getAllPosts = (category) => {
    return $http.get(server+port+'/api/allcategory/' + category)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getArticlesLoc = () => {
    return $http.get(server+port+'/api/location/')
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getPics = (category) => {
    return $http.get(server+port+'/api/pics/' + category)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getArticleById = (id) => {
    return $http.get(server+port+'/api/article/' + id)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.searchTitles = (query) => {
    return $http.get(server+port+'/api/search/' + query)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getComments = (id) => {
    return $http.get(server+port+'/api/comments/' + id)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getOtherArticles = () => {
    return $http.get(server+port+'/api/other/all/')
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getTagList = (category) => {
    return $http.get(server+port+'/api/tags/' + category)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getWeather = (location) => {
    let urlLoc = location.split(' ').join('+');
    let apikey = "c970da0bc976fde269081e7227bd0195";
    return $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + urlLoc + '&APPID=' + apikey)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  // verify authentication before peforming these actions!!
  this.putArticle = function(article) {
    $http.put(server+port+'/api/article/' + article.id, article);
  }

  this.postArticle = function(article) {
    $http.post(server+port+'/api/article', article);
  }

  this.deleteArticle = function(id) {
    $http.delete(server+port+'/api/article/' + id);
  }
})
