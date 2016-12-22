function articleViewCtrl(articleService, $stateParams) {
  var model = this;
  model.$onInit = function() {
    articleService.getArticles()
      .then(function(resp) {
        let articles = resp;
        (function() {
          for (let i = 0; i < articles.length; i++) {
            if (articles[i].id == $stateParams.articleId) {
              model.article = articles[i];
            }
          }
        })();
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  }
}


angular.module('newsApp').component('articleView', {
  templateUrl: './components/articleView/articleView.html',
  controllerAs: 'model',
  controller: ['articleService', '$stateParams', articleViewCtrl]
});
