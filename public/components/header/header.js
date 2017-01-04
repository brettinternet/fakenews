function topMenuCtrl() {
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
  model.getWeather = () => {

  }
  model.timeNow = new Date();
  model.searchShow = false;
  model.showSearch = () => {
    model.searchShow = !model.searchShow;
  }
  model.editShow = false;
  model.showEdit = () => {
    model.editShow = !model.editShow;
  }
}

angular.module('newsApp').component('topMenu', {
  templateUrl: './components/header/header.html',
  controllerAs: 'model',
  controller: topMenuCtrl
});
