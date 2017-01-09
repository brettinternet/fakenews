function bottomMenuCtrl() {
  let model = this;
  model.categories = [
    'business',
    'tech',
    'economy',
    'politics',
    'science'
  ];
  model.categories2 = [
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
