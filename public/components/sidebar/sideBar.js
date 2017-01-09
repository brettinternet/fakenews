function sideBarCtrl() {
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

angular.module('newsApp').component('sideBar', {
  templateUrl: './components/sidebar/sideBar.html',
  controllerAs: 'model',
  controller: sideBarCtrl
});
