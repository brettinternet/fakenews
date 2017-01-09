function editorViewCtrl(articleService) {
  var model = this;
  model.$onInit = function() {
    ngModel.$viewChangeListeners.push(onChange);
    ngModel.$render = onChange;
  }
  function onChange() {
      model.modelValue = model.ngModel.$modelValue;
    }
  model.categories = [
    'front',
    'business',
    'tech',
    'economy',
    'politics',
    'science',
    'health',
    'sports',
    'lifestyle',
    'entertainment',
    'world',
    'opinion'
  ];
  model.currentCat = 'front';
  model.setCategory = (category) => {
    model.currentCat = category;
    articleService.getArticles(model.currentCat)
      .then(function(resp) {
        model.articles = resp;
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  }
  model.articles = [];
  model.$onInit = function() {
    articleService.getAllPosts(model.currentCat)
      .then(function(resp) {
        model.articles = resp;
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  }
  model.updateTime = () => {
    model.editArticle.createdat = new Date();
  }
  model.clearButton = () => {
    model.editArticle = {};
    model.confirm = '';
  }
  model.openArticle = (article) => model.editArticle = article;
  model.putArticle = function(article) {
    articleService.putArticle(article);
    model.confirm = 'Article saved';
  }
  model.postArticle = function(article) {
    articleService.postArticle(article);
    model.editArticle = '';
  }
  model.deleteArticle = function(article) {
    articleService.deleteArticle(article.id);
    model.editArticle = '';
  }
  model.submitArticle = function(article) {
    if (!article.title) {
      model.confirmErr = 'Missing title';
    } else if (!article.id) {
      model.postArticle(article);
    } else {
      model.putArticle(article);
    }
  }
}

angular.module('newsApp').component('editorView', {
  templateUrl: './components/editorView/editorView.html',
  controllerAs: 'model',
  controller: ['articleService', editorViewCtrl],
  // require: 'ngModel'
});
