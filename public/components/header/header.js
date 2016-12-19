function topMenuCtrl($scope, $state) {
  $scope.categories = [
    'business',
    'politics',
    'economy',
    'tech',
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
