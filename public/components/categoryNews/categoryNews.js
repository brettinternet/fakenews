function categoryNewsCtrl($stateParams, articleService) {
  let model = this;
  // model.articles = [];
  model.$onInit = function() {
    model.category = $stateParams.category;
    articleService.getArticles(model.category)
      .then(function(res) {
        model.articles = res;
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      })
  }
}

angular.module('newsApp').component('categoryNews', {
  templateUrl: './components/categoryNews/categoryNews.html',
  controllerAs: 'model',
  controller: ['$stateParams', 'articleService', categoryNewsCtrl]
});
