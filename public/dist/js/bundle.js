'use strict';

angular.module('newsApp').config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider.state('home', {
    url: '/',
    template: '<landing></landing>'
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
  this.getArticles = function () {
    return $http.get('sampleData.json');
  };
  // get article by article_id
  this.getArticle = function () {
    return $http.get('sampleData.json');
  };
});
'use strict';

function articleViewCtrl($scope, articleService, $stateParams) {
  (function () {
    articleService.getArticle().then(function (resp) {
      var articles = resp.data;
      (function () {
        for (var i = 0; i < articles.length; i++) {
          if (articles[i].id == $stateParams.articleId) {
            $scope.article = articles[i];
            $scope.tags = $scope.article.tags;
          }
        }
      })();
    }).catch(function (err) {
      $scope.error = err;
      console.error(err);
    });
  })();
}

angular.module('newsApp').component('articleView', {
  templateUrl: './components/articleView/articleView.html',
  controller: articleViewCtrl,
  bindings: {
    tags: "<"
  }
});
'use strict';

function categoryCtrl($scope, $stateParams, $http) {
  $scope.currentCat = $stateParams.category;
}

angular.module('newsApp').component('categoryBusiness', {
  templateUrl: './components/category/business.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryPolitics', {
  templateUrl: './components/category/politics.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryEconomy', {
  templateUrl: './components/category/economy.html',
  controller: categoryCtrl
});

angular.module('newsApp').component('categoryTech', {
  templateUrl: './components/category/tech.html',
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

function categoryNewsCtrl($scope, $state, articleService) {
  // console.log($state.params.category);
  (function () {
    articleService.getArticles().then(function (resp) {
      $scope.articles = resp.data;
    }).catch(function (err) {
      $scope.error = err;
      console.error(err);
    });
  })();
}

angular.module('newsApp').component('categoryNews', {
  templateUrl: './components/categoryNews/categoryNews.html',
  controller: categoryNewsCtrl
});
'use strict';

function errorDisplayCtrl($scope) {}

angular.module('newsApp').component('errorDisplay', {
  templateUrl: './components/errorDisplay/errorDisplay.html',
  controller: errorDisplayCtrl
});
'use strict';

function topMenuCtrl($scope, $state) {
  $scope.categories = ['business', 'politics', 'economy', 'tech', 'sports', 'lifestyle', 'entertainment', 'world', 'opinion'];
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
//# sourceMappingURL=bundle.js.map
