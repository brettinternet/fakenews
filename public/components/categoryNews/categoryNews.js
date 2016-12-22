function categoryNewsCtrl($stateParams, articleService) {
  let model = this;
  // model.articles = [];
  console.log($stateParams);
  model.$onInit = function() {
    model.category = $stateParams.category;
    console.log(model.category);
    articleService.getArticles(model.category.category)
      .then(function(res) {
        model.articles = res;
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  }
}

angular.module('newsApp').component('categoryNews', {
  templateUrl: './components/categoryNews/categoryNews.html',
  controllerAs: 'model',
  controller: ['$stateParams', 'articleService', categoryNewsCtrl]
});
