function addonCategoryCtrl() {
  
}

angular.module('newsApp').component('addonCategory', {
  templateUrl: './components/pageAddons/addonCategory.html',
  controllerAs: 'model',
  controller: ['$stateParams', 'articleService', addonCategoryCtrl]
});
