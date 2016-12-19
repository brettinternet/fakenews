function addonPageCtrl($scope, $stateParams) {
  $scope.currentCat = $stateParams.category;
  console.log($scope.tags);
  // console.log(tags);
  console.log($stateParams);

}

angular.module('newsApp').component('addonCategory', {
  templateUrl: './components/pageAddons/addonCategory.html',
  controller: addonPageCtrl
});

angular.module('newsApp').component('addonArticle', {
  templateUrl: './components/pageAddons/addonArticle.html',
  controller: addonPageCtrl,
  bindings: {
    tags: "<"
  }
});
