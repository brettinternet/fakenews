angular.module('newsApp').config(function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      template: '<landing></landing>'
    })
    .state('editor', {
      url: '/editor',
      template: '<editor-view></editor-view>'
    })
    .state('search', {
      url: '/search',
      template: '<search-view></search-view>'
    })
    .state('category', {
      url: '/:category',
      template: ($state) => {
        return ['<category-', $state.category, '></category-', $state.category, '>'].join("")
      }
    })
    .state('article', {
      url: '/:category/:articleId',
      template: '<article-view></article-view>'
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
