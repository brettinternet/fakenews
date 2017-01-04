function categoryNewsCtrl($stateParams, articleService) {
  let model = this;
  let modifyResponse = (articles) => {
    model.articlesMore = articles.splice(3);
  }
  model.$onInit = function() {
    model.category = $stateParams.category;
    articleService.getArticles(model.category)
      .then(function(res) {
        model.articles = res;
        modifyResponse(model.articles);
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
    articleService.getPics(model.category)
      .then(function(res) {
        model.pics = res;
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
  }
}

angular.module('newsApp').component('categoryNews', {
  templateUrl: './components/categoryNews/categoryNews.html',
  controllerAs: 'model',
  controller: ['$stateParams', 'articleService', categoryNewsCtrl]
});
