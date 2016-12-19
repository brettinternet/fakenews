function categoryNewsCtrl($scope, $state, articleService) {
  // console.log($state.params.category);
  (function() {
    articleService.getArticles()
      .then(function(resp) {
        $scope.articles = resp.data;
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  })();

}

angular.module('newsApp').component('categoryNews', {
  templateUrl: './components/categoryNews/categoryNews.html',
  controller: categoryNewsCtrl
});
