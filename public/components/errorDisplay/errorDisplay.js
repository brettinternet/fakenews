function errorDisplayCtrl() {
  let model = this;
}

angular.module('newsApp').component('errorDisplay', {
  templateUrl: './components/errorDisplay/errorDisplay.html',
  controllerAs: 'model',
  controller: errorDisplayCtrl,
  bindings: {
    error: '<',
    softerr: '<'
  },
  require: '^searchViewCtrl'
});
