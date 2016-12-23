function articleViewCtrl(articleService, $stateParams) {
  let model = this;
  let modifyResponse = function(article, author) {
    author.name = author.firstname + ' ' + author.lastname;
    console.log(article.tags);
    console.log(article.tags.length);
    if (article.tags[0] === null) {
      article.tags = ['No tags'];
      console.log('done');
    }
  }
  model.$onInit = function() {
    articleService.getArticleById($stateParams.articleId)
      .then(function(res) {
        model.article = res.article;
        model.author = res.author;
        modifyResponse(model.article, model.author);
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
