angular.module('newsApp').config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      template: '<landing></landing>',
    })
    .state('category', {
      url: '/:category',
      template: ($state) => {
        return ['<category-', $state.category, '></category-', $state.category, '>'].join("")
      }
    })
    .state('article', {
      url: '/:category/:articleId',
      template: '<article-view></article-view>',
    })
  $urlRouterProvider.otherwise('/');
  // $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('');
})

/*
- Business
- Economy
- Politics
- Tech
- Sports
- Lifestyle
- Entertainment
- World
- Opinions
*/
