angular.module('newsApp').service('articleService', function($http) {
  // get articles by category
  this.getArticles = (category) => {
    return $http.get('http://localhost:3000/api/category/' + category)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getPics = (category) => {
    return $http.get('http://localhost:3000/api/pics/' + category)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getArticleById = (id) => {
    return $http.get('http://localhost:3000/api/article/' + id)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.searchTitles = (query) => {
    return $http.get('http://localhost:3000/api/search/' + query)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getComments = (id) => {
    return $http.get('http://localhost:3000/api/comments/' + id)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getOtherArticles = () => {
    return $http.get('http://localhost:3000/api/other/all/')
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getTagList = (category) => {
    return $http.get('/api/tags/' + category)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }

  this.getWeather = (location) => {
    return $http.get('http://localhost:3000/api/weather/' + location)
      .then(function(res) {
        return res.data;
      })
      .catch(function(err) {
        console.error(err)
      });
  }


  // verify authentication before peforming these actions!!
  // this.putArticle = function(article) {
  //   $http.put('sampleData.json', newArticle);
  // }
  // this.postArticle = function() {
  //   $http.post('sampleData.json', newArticle);
  // }
  // this.deleteArticle = function(id) {
  //   $http.delete('sampleData.json');
  // }
})
