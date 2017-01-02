function landingCtrl(articleService) {
  let model = this;
  let modifyResponse = (articles) => {
    model.articlesMore = articles.splice(3);
  }
  model.$onInit = function() {
    model.category = 'front';
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
        modifyResponse(model.articles);
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
  }
}

angular.module('newsApp').component('landing', {
  templateUrl: './components/landing/landing.html',
  controllerAs: 'model',
  controller: ['articleService', landingCtrl]
});
