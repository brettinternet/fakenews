function topMenuCtrl($scope, $state) {
  $scope.categories = [
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

angular.module('newsApp').component('topMenu', {
  templateUrl: './components/header/header.html',
  controller: topMenuCtrl
});
