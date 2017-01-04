function bottomMenuCtrl() {
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
}

angular.module('newsApp').component('bottomMenu', {
  templateUrl: './components/footer/bottomMenu.html',
  controllerAs: 'model',
  controller: bottomMenuCtrl
});
