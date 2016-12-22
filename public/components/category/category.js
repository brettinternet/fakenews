function categoryCtrl($scope, $stateParams) {
  $scope.currentCat = $stateParams.category;
  var model = this;
  
}

angular.module('newsApp').component('categoryBusiness', {
  templateUrl: './components/category/business.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryTech', {
  templateUrl: './components/category/tech.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryEconomy', {
  templateUrl: './components/category/economy.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryPolitics', {
  templateUrl: './components/category/politics.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryScience', {
  templateUrl: './components/category/science.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryHealth', {
  templateUrl: './components/category/health.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categorySports', {
  templateUrl: './components/category/sports.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryLifestyle', {
  templateUrl: './components/category/lifestyle.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryEntertainment', {
  templateUrl: './components/category/entertainment.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryWorld', {
  templateUrl: './components/category/world.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryOpinion', {
  templateUrl: './components/category/opinion.html',
  controller: categoryCtrl
});
