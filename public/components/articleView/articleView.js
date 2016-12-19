function articleViewCtrl($scope, articleService, $stateParams) {
  (function() {
    articleService.getArticle()
      .then(function(resp) {
        var articles = resp.data;
        (function() {
          for (var i = 0; i < articles.length; i++) {
            if (articles[i].id == $stateParams.articleId) {
              $scope.article = articles[i];
              $scope.tags = $scope.article.tags;
            }
          }
        })();
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  })();
}

angular.module('newsApp').component('articleView', {
  templateUrl: './components/articleView/articleView.html',
  controller: articleViewCtrl,
  bindings: {
    tags: "<"
  }
});
