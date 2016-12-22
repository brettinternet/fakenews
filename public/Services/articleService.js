angular.module('newsApp').service('articleService', function($http) {
  // get articles by category
  this.getArticles = function(category) {
    return $http.get('http://localhost:3000/api/' + category)
      .then(function(res) {
        console.log(res.data);
        return res.data;
      })
      .catch((err) => console.error(err));
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
