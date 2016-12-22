function addonArticleCtrl($stateParams, articleService) {
  var model = this;
  model.currentCat = $stateParams.category;
  // replace with sql query
  model.$onInit = function() {
    articleService.getArticles()
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
