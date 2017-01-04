function categoryNewsCtrl($stateParams, articleService) {
  let model = this;
  model.$onInit = function() {
    model.category = $stateParams.category;
    articleService.getArticles(model.category)
      .then(function(res) {
        model.articles = res;
        model.articlesMore = model.articles.splice(5);
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
        if (res.length > 6) {
          model.pics = res;
          model.picsMore = model.pics.splice(4);
          model.picsMore2 = model.picsMore.splice(3);
        } else if (6 >= res.length > 3) {
          model.pics = res;
          model.picsMore = model.pics.splice(3);
        } else {
          model.pics = res;
        }
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
