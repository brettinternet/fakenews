function searchViewCtrl(articleService) {
  var model = this;
  let modifyResponse = function(articles) {
    if (articles.length < 1) {
      model.softerr = 'No articles match your search.';
    }
  }
  model.submitSearch = (query) => {
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

angular.module('newsApp').component('searchView', {
  templateUrl: './components/searchView/searchView.html',
  controllerAs: 'model',
  controller: ['articleService', searchViewCtrl]
});
