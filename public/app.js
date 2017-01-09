angular.module('newsApp', ['ui.router', 'slickCarousel', 'angularMoment', 'ngSanitize', 'ngAnimate', 'ngTouch', 'angular-loading-bar']);

angular.module('newsApp')
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
}]);
