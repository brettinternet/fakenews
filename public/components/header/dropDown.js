function dropDownCtrl(articleService) {
  var model = this;

}

angular.module('newsApp').component('dropDown', {
  templateUrl: './components/header/dropDown.html',
  controllerAs: 'model',
  controller: ['articleService', dropDownCtrl],
});
