function searchViewCtrl($state, articleService) {
  var model = this;
  let modifyResponse = function(articles) {
    if (articles.length < 1) {
      model.softerr = 'No articles match your search.';
    }
  }
  model.$onInit = () => {
    model.submitSearch = (query) => {
      if(search.$valid) {
        $state.href('/search/:query');
      };
      articleService.searchTitles(query)
        .then(function(res) {
          model.articles = res;
          modifyResponse(model.articles)
        })
        .catch(function(err) {
          model.error = err;
          console.error(err);
        })
    }
  }
  model.showButton = () => {
    model.buttonShow = !model.buttonShow;
  }
}

angular.module('newsApp').component('searchView', {
  templateUrl: './components/searchView/searchView.html',
  controllerAs: 'model',
  controller: ['articleService', '$state', searchViewCtrl]
});

angular.module('newsApp').component('searchForm', {
  templateUrl: './components/searchView/searchForm.html',
  controllerAs: 'model',
  controller: ['articleService', '$state', searchViewCtrl]
});
