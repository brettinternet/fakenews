function addonArticleCtrl($stateParams, articleService) {
  var model = this;
  model.$onInit = function() {
    model.currentCat = $stateParams.category;
    articleService.getArticles($stateParams.category)
      .then(function(resp) {
        model.articleMatches = resp;
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  }
}


angular.module('newsApp').component('addonArticle', {
  templateUrl: './components/pageAddons/addonArticle.html',
  controllerAs: 'model',
  controller: ['$stateParams', 'articleService', addonArticleCtrl],
  bindings: {
    tags: '<'
  },
  require: {
    articleCtrl: '^articleView'
  }
});
