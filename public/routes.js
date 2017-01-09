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
      template: '<search-view></search-view>',
    })
    .state('tags', {
      url: '/tags/:tag',
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
  $locationProvider.hashPrefix('');
  // $locationProvider.html5Mode(true);
})
