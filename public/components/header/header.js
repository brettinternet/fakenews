function topMenuCtrl($state) {
  let model = this;
  model.categories = [
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
  model.searchShow = false;
  model.showSearch = () => {
    model.searchShow = !model.searchShow;
  }
}

angular.module('newsApp').component('topMenu', {
  templateUrl: './components/header/header.html',
  controllerAs: 'model',
  controller: topMenuCtrl
});
