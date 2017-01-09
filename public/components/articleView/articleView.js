function articleViewCtrl(articleService, $stateParams) {
  let model = this;
  model.category = $stateParams.category;
  let modifyResponse = function(article, author) {
    author.name = author.firstname + ' ' + author.lastname;
    let artArr = article.body.match(/[^\.!\?]+[\.!\?]+/g);
    if (artArr && artArr[2].charAt(0) === " ") {
      artArr[2] = "<br/>" + artArr[2].slice(1);
    }
    model.article.body = artArr.join(' ');
  }
  model.$onInit = function() {
    articleService.getArticleById($stateParams.articleId)
      .then(function(res) {
        model.article = res.article;
        if (res.author) {
          model.author = res.author;
          modifyResponse(model.article, model.author);
        }
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
    articleService.getArticles($stateParams.category)
      .then(function(resp) {
        model.articleMatches = resp;
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
  }
}


angular.module('newsApp').component('articleView', {
  templateUrl: './components/articleView/articleView.html',
  controllerAs: 'model',
  controller: ['articleService', '$stateParams', articleViewCtrl]
});
