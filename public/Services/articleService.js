angular.module('newsApp').service('articleService', function($http) {
  // get articles by category
  this.getArticles = (category) => {
    return $http.get('http://localhost:3000/api/' + category)
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
    return $http.get('http://localhost:3000/api/search?title=' + query)
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
