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
  }).state('tags', {
    url: '/tags/:tag',
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
    return $http.get('http://localhost:3000/api/category/' + category).then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.error(err);
    });
  };

  this.getArticlesLoc = function () {
    return $http.get('http://localhost:3000/api/location/').then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.error(err);
    });
  };

  this.getPics = function (category) {
    return $http.get('http://localhost:3000/api/pics/' + category).then(function (res) {
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
    return $http.get('http://localhost:3000/api/search/' + query).then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.error(err);
    });
  };

  this.getComments = function (id) {
    return $http.get('http://localhost:3000/api/comments/' + id).then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.error(err);
    });
  };

  this.getOtherArticles = function () {
    return $http.get('http://localhost:3000/api/other/all/').then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.error(err);
    });
  };

  this.getTagList = function (category) {
    return $http.get('/api/tags/' + category).then(function (res) {
      return res.data;
    }).catch(function (err) {
      console.error(err);
    });
  };

  this.getWeather = function (location) {
    var urlLoc = location.split(' ').join('+');
    var apikey = "c970da0bc976fde269081e7227bd0195";
    return $http.get('http://api.openweathermap.org/data/2.5/weather?q=' + urlLoc + '&APPID=' + apikey).then(function (res) {
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
"use strict";

function articleViewCtrl(articleService, $stateParams) {
  var model = this;
  var modifyResponse = function modifyResponse(article, author) {
    author.name = author.firstname + ' ' + author.lastname;
    var artArr = article.body.match(/[^\.!\?]+[\.!\?]+/g);
    if (artArr[2].charAt(0) === " ") {
      artArr[2] = "<br/>" + artArr[2].slice(1);
    }
    model.article.body = artArr.join(' ');
  };
  model.$onInit = function () {
    articleService.getArticleById($stateParams.articleId).then(function (res) {
      model.article = res.article;
      if (res.author) {
        model.author = res.author;
        modifyResponse(model.article, model.author);
      }
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
    articleService.getArticles($stateParams.category).then(function (resp) {
      model.articleMatches = resp;
    }).catch(function (err) {
      model.error = err;
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

function categoryNewsCtrl($stateParams, articleService) {
  var model = this;
  model.$onInit = function () {
    model.category = $stateParams.category;
    articleService.getArticles(model.category).then(function (res) {
      model.articles = res;
      model.articlesMore = model.articles.splice(5);
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
    articleService.getTagList(model.category).then(function (res) {
      model.catTags = res;
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
    articleService.getPics(model.category).then(function (res) {
      if (res.length > 6) {
        model.pics = res;
        model.picsMore = model.pics.splice(4);
        model.picsMore2 = model.picsMore.splice(3);
      } else if (6 >= res.length > 3) {
        model.pics = res;
        model.picsMore = model.pics.splice(3);
      } else {
        model.pics = res;
      }
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

function comments(articleService, $stateParams) {
  var model = this;
  var modifyResponse = function modifyResponse(comments) {
    for (var i = 0; i < comments.length; i++) {
      if (comments[i].country !== 'US') {
        comments[i].locCountry = comments[i].country;
      } else {
        comments[i].locState = comments[i].state;
      }
    }
  };
  model.$onInit = function () {
    articleService.getComments($stateParams.articleId).then(function (res) {
      model.comments = res;
      modifyResponse(model.comments);
    }).catch(function (err) {
      $scope.error = err;
      console.error(err);
    });
  };
}

angular.module('newsApp').component('comments', {
  templateUrl: './components/comments/comments.html',
  controllerAs: 'model',
  controller: ['articleService', '$stateParams', comments]
});
'use strict';

function editorViewCtrl(articleService) {
  var model = this;
  model.$onInit = function () {
    ngModel.$viewChangeListeners.push(onChange);
    ngModel.$render = onChange;
  };
  function onChange() {
    model.modelValue = model.ngModel.$modelValue;
  }
  model.categories = ['front', 'business', 'tech', 'economy', 'politics', 'science', 'health', 'sports', 'lifestyle', 'entertainment', 'world', 'opinion'];
  model.currentCat = 'front';
  model.setCategory = function (category) {
    model.currentCat = category;
    articleService.getArticles(model.currentCat).then(function (resp) {
      model.articles = resp;
    }).catch(function (err) {
      $scope.error = err;
      console.error(err);
    });
  };
  model.articles = [];
  model.$onInit = function () {
    articleService.getArticles(model.currentCat).then(function (resp) {
      model.articles = resp;
    }).catch(function (err) {
      $scope.error = err;
      console.error(err);
    });
  };
  model.updateTime = function () {
    model.editArticle.createdat = new Date();
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

function bottomMenuCtrl() {
  var model = this;
  model.categories = ['business', 'tech', 'economy', 'politics', 'science', 'health', 'sports', 'lifestyle', 'entertainment', 'world', 'opinion'];
}

angular.module('newsApp').component('bottomMenu', {
  templateUrl: './components/footer/bottomMenu.html',
  controllerAs: 'model',
  controller: bottomMenuCtrl
});
'use strict';

function topMenuCtrl(articleService) {
  var model = this;
  model.categories = ['business', 'tech', 'economy', 'politics', 'science', 'health', 'sports', 'lifestyle', 'entertainment', 'world', 'opinion'];
  model.cityWeather = 'Los Angeles';
  model.getWeather = function (city) {
    if (city == '') city = 'Los Angeles';
    articleService.getWeather(city).then(function (res) {
      model.weatherObj = {
        max: Math.floor((res.main.temp_max - 273) * (9 / 5) + 32),
        min: Math.floor((res.main.temp_min - 273) * (9 / 5) + 32)
      };
      model.cityWeather = res.name;
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
  };

  model.$onInit = function () {
    model.getWeather(model.cityWeather);
  };

  model.timeNow = new Date();
  model.searchShow = false;
  model.showSearch = function () {
    model.searchShow = !model.searchShow;
  };
  model.editShow = false;
  model.showEdit = function () {
    model.editShow = !model.editShow;
  };
}

angular.module('newsApp').component('topMenu', {
  templateUrl: './components/header/header.html',
  controllerAs: 'model',
  controller: ['articleService', topMenuCtrl]
});
'use strict';

function landingCtrl(articleService) {
  var model = this;
  model.artbreak = [];
  var modifyResponse = function modifyResponse(articles) {
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].breakingnews) {
        var rem = articles.splice(i, 1)[0];
        model.artbreak.push(rem);
      }
    }
    model.articlesMore = articles.splice(3);
    model.slickOn = true;
  };
  model.slickOn = false;
  model.slickConfig = {
    enabled: true,
    autoplay: true,
    arrows: false,
    draggable: true,
    infinite: true,
    autoplaySpeed: 5000,
    dots: true,
    fade: true
  };

  model.setupMap = function (arr) {
    var options = {
      // tilting: false,
      minAltitude: 300000
    };
    var earth = new WE.map('earth_div', options);
    WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(earth);
    earth.setTilt(50);
    // earth.setHeading(300);

    arr.forEach(function (i) {
      var marker = WE.marker([i.lat, i.long]).addTo(earth);
      marker.bindPopup("<a href='#/" + i.category + "/" + i.id + "'><b>" + i.title + "</b></a><br><span style='text-transform: capitalize;'>" + i.city + "</span>", { maxWidth: 150, closeButton: true }); //.openPopup();
    });

    var before = null;
    requestAnimationFrame(function animate(now) {
      var c = earth.getPosition();
      var elapsed = before ? now - before : 0;
      before = now;
      earth.setCenter([c[0], c[1] + 0.1 * (elapsed / 30)]);
      requestAnimationFrame(animate);
    });

    // earth.setView([arr[0].lat,arr[0].long], 4);
    earth.setView([37.089000, -138.533000], 1.5);
  };

  model.$onInit = function () {
    articleService.getArticlesLoc().then(function (res) {
      var arr = res.filter(function (i) {
        return i.lat && i.long;
      });
      model.setupMap(arr);
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
    model.category = 'front';
    articleService.getArticles(model.category).then(function (res) {
      model.articles = res;
      modifyResponse(model.articles);
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
    articleService.getOtherArticles().then(function (res) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].breakingnews) {
          var rem = res.splice(i, 1)[0];
          model.artbreak.push(rem);
        }
      }
      model.slickOn = true;
      model.articlesOther = res;
      model.articlesOtherMore = model.articlesOther.splice(4);
      model.articlesOtherMore2 = model.articlesOtherMore.splice(4);
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
    articleService.getTagList(model.category).then(function (res) {
      model.catTags = res;
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
    articleService.getPics(model.category).then(function (res) {
      model.pics = res;
      model.picsMore = model.pics.splice(4);
      model.picsMore2 = model.picsMore.splice(3);
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
  };
}

angular.module('newsApp').component('landing', {
  templateUrl: './components/landing/landing.html',
  controllerAs: 'model',
  controller: ['articleService', landingCtrl]
});
'use strict';

function searchViewCtrl($state, articleService) {
  var model = this;
  var modifyResponse = function modifyResponse(articles) {
    if (articles.length < 1) {
      model.softerr = 'No articles match your search.';
    }
  };
  model.$onInit = function () {
    model.submitSearch = function (query) {
      if (search.$valid) {
        $state.href('/search/:query');
      };
      articleService.searchTitles(query).then(function (res) {
        model.articles = res;
        modifyResponse(model.articles);
      }).catch(function (err) {
        model.error = err;
        console.error(err);
      });
    };
  };
}

angular.module('newsApp').component('searchView', {
  templateUrl: './components/searchView/searchView.html',
  controllerAs: 'model',
  controller: ['articleService', '$state', searchViewCtrl]
});

angular.module('newsApp').component('searchForm', {
  templateUrl: './components/searchView/searchForm.html',
  controllerAs: 'model',
  controller: ['articleService', '$state', searchViewCtrl]
});
'use strict';

function worldMapCtrl(articleService) {
  var model = this;

  model.setupMap = function (arr) {
    console.log(arr);
    var map = new L.map('flat_earth_div');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
      // maxZoom: 18,
      // id: '',
      // accessToken: 'pk.eyJ1IjoiYnJldHRpbnRlcm5ldCIsImEiOiJjaXhrcXl2bDUwMDRrMnducWQxYnE2cGJ6In0.EnmG2JKxi_5aTOhMzTCozw'
    }).addTo(map);

    arr.forEach(function (i) {
      var marker = L.marker([i.lat, i.long]).addTo(map);
      marker.bindPopup("<a href='#/" + i.category + "/" + i.id + "'><b>" + i.title + "</b></a><br><span style='text-transform: capitalize;'>" + i.city + "</span>", { maxWidth: 150, closeButton: true });
    });

    map.setView([arr[0].lat, arr[0].long], 1.5);
  };

  model.$onInit = function () {
    articleService.getArticlesLoc().then(function (res) {
      var arr = res.filter(function (i) {
        return i.lat && i.long;
      });
      model.setupMap(arr);
    }).catch(function (err) {
      model.error = err;
      console.error(err);
    });
  };
}

angular.module('newsApp').component('worldMap', {
  templateUrl: './components/worldMap/worldMap.html',
  controllerAs: 'model',
  controller: ['articleService', worldMapCtrl]
});
'use strict';

angular.module('newsApp').filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                //Also remove . and , so its gives a cleaner result.
                if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                    lastspace = lastspace - 1;
                }
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});
//# sourceMappingURL=bundle.js.map
