function searchViewCtrl(articleService) {
  var model = this;
  model.articles = [];
  model.$onInit = function() {
    articleService.getArticles()
      .then(function(resp) {
        model.articles = resp;
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  }
}

angular.module('newsApp').component('searchView', {
  templateUrl: './components/searchView/searchView.html',
  controllerAs: 'model',
  controller: ['articleService', searchViewCtrl]
});
