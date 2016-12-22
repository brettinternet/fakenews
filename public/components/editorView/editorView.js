function editorViewCtrl(articleService) {
  // TODO: assign random author according to category


  var model = this;
  model.$onInit = function() {
    ngModel.$viewChangeListeners.push(onChange);
    ngModel.$render = onChange;
  }
  function onChange() {
      model.modelValue = model.ngModel.$modelValue;
    }
  model.categories = [
    'business',
    'politics',
    'economy',
    'tech',
    'sports',
    'lifestyle',
    'entertainment',
    'world',
    'opinion'
  ];
  model.articles = [];
  model.$onInit = function() {
    articleService.getArticles()
      .then(function(resp) {
        model.articles = resp;
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  }
  model.openArticle = (article) => model.editArticle = article;
  var putArticle = function() {
    articleService.putArticle(article);
    model.editArticle = '';
  }
  var postArticle = function() {
    articleService.postArticle(article);
    model.editArticle = '';
  }
  model.deleteArticle = function(article) {
    articleService.deleteArticle(article.id);
    model.editArticle = '';
  }
  model.submitArticle = function(article) {
    console.log(article);
    if (article.id == null) {
      console.log('no id');
      postArticle(article);
    } else {
      console.log('yes id');
      putArticle(article);
    }
  }
}

angular.module('newsApp').component('editorView', {
  templateUrl: './components/editorView/editorView.html',
  controllerAs: 'model',
  controller: ['articleService', editorViewCtrl],
  require: 'ngModel'
});