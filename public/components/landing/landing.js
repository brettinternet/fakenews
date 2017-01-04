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
    articleService.getOtherArticles(model.category)
      .then(function(res) {
        model.articlesOther = res;
        model.articlesOtherMore = model.articlesOther.splice(4);
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
    articleService.getTagList(model.category)
      .then(function(res) {
        model.catTags = res;
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
    articleService.getPics(model.category)
      .then(function(res) {
        model.pics = res;
        model.picsMore = model.pics.splice(4);
        model.picsMore2 = model.picsMore.splice(3);
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
