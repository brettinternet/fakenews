angular.module('newsApp').service('articleService', function($http) {
  // get articles by category
  this.getArticles = function() {
    return $http.get('sampleData.json')
  }
  // get article by article_id
  this.getArticle = function() {
    return $http.get('sampleData.json')
  }
})
