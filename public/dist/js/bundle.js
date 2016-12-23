'use strict';

angular.module('newsApp').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider.state('home', {
    url: '/',
    template: '<landing></landing>'
  }).state('editor', {
    url: '/editor',
    template: '<editor-view></editor-view>'
  }).state('search', {
    url: '/search',
    template: '<search-view></search-view>'
  }).state('category', {
    url: '/:category',
    template: function template($state) {
      return ['<category-', $state.category, '></category-', $state.category, '>'].join("");
    }
  }).state('article', {
    url: '/:category/:articleId',
    template: '<article-view></article-view>'
  });
  $urlRouterProvider.otherwise('/');
  // $locationProvider.html5Mode(true);
  $locationProvider.hashPrefix('');
});

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
'use strict';

angular.module('newsApp').service('articleService', function ($http) {
  // get articles by category
  this.getArticles = function (category) {
    return $http.get('http://localhost:3000/api/' + category).then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.error(err);
    });
  };

  this.getArticleById = function (id) {
    return $http.get('http://localhost:3000/api/article/' + id).then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.error(err);
    });
  };

  this.searchTitles = function (query) {
    return $http.get('http://localhost:3000/api/search?title=' + query).then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.error(err);
    });
  };

  // verify authentication before peforming these actions!!
  // this.putArticle = function(article) {
  //   $http.put('sampleData.json', newArticle);
  // }
  // this.postArticle = function() {
  //   $http.post('sampleData.json', newArticle);
  // }
  // this.deleteArticle = function(id) {
  //   $http.delete('sampleData.json');
  // }
});
'use strict';

function articleViewCtrl(articleService, $stateParams) {
  var model = this;
  var modifyResponse = function modifyResponse(article, author) {
    author.name = author.firstname + ' ' + author.lastname;
    console.log(article.tags);
    console.log(article.tags.length);
    if (article.tags[0] === null) {
      article.tags = ['No tags'];
      console.log('done');
    }
  };
  model.$onInit = function () {
    articleService.getArticleById($stateParams.articleId).then(function (res) {
      model.article = res.article;
      model.author = res.author;
      modifyResponse(model.article, model.author);
    }).catch(function (err) {
      $scope.error = err;
      console.error(err);
    });
  };
}

angular.module('newsApp').component('articleView', {
  templateUrl: './components/articleView/articleView.html',
  controllerAs: 'model',
  controller: ['articleService', '$stateParams', articleViewCtrl]
});
'use strict';

function categoryCtrl($stateParams) {
  var model = this;
  model.currentCat = $stateParams.category;
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
'use strict';

function categoryNewsCtrl($stateParams, articleService) {
  var model = this;
  // model.articles = [];
  model.$onInit = function () {
    model.category = $stateParams.category;
    articleService.getArticles(model.category).then(function (res) {
      model.articles = res;
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
  };
}

angular.module('newsApp').component('categoryNews', {
  templateUrl: './components/categoryNews/categoryNews.html',
  controllerAs: 'model',
  controller: ['$stateParams', 'articleService', categoryNewsCtrl]
});
'use strict';

function editorViewCtrl(articleService) {
  // TODO: assign random author according to category


  var model = this;
  model.$onInit = function () {
    ngModel.$viewChangeListeners.push(onChange);
    ngModel.$render = onChange;
  };
  function onChange() {
    model.modelValue = model.ngModel.$modelValue;
  }
  model.categories = ['business', 'politics', 'economy', 'tech', 'sports', 'lifestyle', 'entertainment', 'world', 'opinion'];
  model.articles = [];
  model.$onInit = function () {
    articleService.getArticles().then(function (resp) {
      model.articles = resp;
    }).catch(function (err) {
      $scope.error = err;
      console.error(err);
    });
  };
  model.openArticle = function (article) {
    return model.editArticle = article;
  };
  var putArticle = function putArticle() {
    articleService.putArticle(article);
    model.editArticle = '';
  };
  var postArticle = function postArticle() {
    articleService.postArticle(article);
    model.editArticle = '';
  };
  model.deleteArticle = function (article) {
    articleService.deleteArticle(article.id);
    model.editArticle = '';
  };
  model.submitArticle = function (article) {
    console.log(article);
    if (article.id == null) {
      console.log('no id');
      postArticle(article);
    } else {
      console.log('yes id');
      putArticle(article);
    }
  };
}

angular.module('newsApp').component('editorView', {
  templateUrl: './components/editorView/editorView.html',
  controllerAs: 'model',
  controller: ['articleService', editorViewCtrl],
  require: 'ngModel'
});
'use strict';

function errorDisplayCtrl() {
  var model = this;
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
'use strict';

function topMenuCtrl($scope, $state) {
  $scope.categories = ['business', 'tech', 'economy', 'politics', 'science', 'health', 'sports', 'lifestyle', 'entertainment', 'world', 'opinion'];
}

angular.module('newsApp').component('topMenu', {
  templateUrl: './components/header/header.html',
  controller: topMenuCtrl
});
'use strict';

function landingCtrl() {}

angular.module('newsApp').component('landing', {
  templateUrl: './components/landing/landing.html',
  controller: landingCtrl
});
'use strict';

function addonArticleCtrl($stateParams, articleService) {
  var model = this;
  model.currentCat = $stateParams.category;
  // replace with sql query
  model.$onInit = function () {
    articleService.getArticles().then(function (resp) {
      model.articleMatches = resp;
    }).catch(function (err) {
      $scope.error = err;
      console.error(err);
    });
  };
}

angular.module('newsApp').component('addonArticle', {
  templateUrl: './components/pageAddons/addonArticle.html',
  controllerAs: 'model',
  controller: ['$stateParams', 'articleService', addonArticleCtrl],
  bindings: {
    tags: '<'
  },
  require: {
    articleCtrl: '^articleView'
  }
});
'use strict';

function addonCategoryCtrl() {}

angular.module('newsApp').component('addonCategory', {
  templateUrl: './components/pageAddons/addonCategory.html',
  controllerAs: 'model',
  controller: ['$stateParams', 'articleService', addonCategoryCtrl]
});
'use strict';

function searchViewCtrl(articleService) {
  var model = this;
  var modifyResponse = function modifyResponse(articles) {
    if (articles.length < 1) {
      model.softerr = 'No articles match your search.';
    }
  };
  model.submitSearch = function (query) {
    articleService.searchTitles(query).then(function (res) {
      model.articles = res;
      modifyResponse(model.articles);
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
  };
}

angular.module('newsApp').component('searchView', {
  templateUrl: './components/searchView/searchView.html',
  controllerAs: 'model',
  controller: ['articleService', searchViewCtrl]
});
//# sourceMappingURL=bundle.js.map
