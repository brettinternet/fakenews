function topMenuCtrl(articleService) {
  let model = this;
  model.categories = [
    'business',
    'tech',
    'economy',
    'politics',
    'science',
    'health',
    'sports',
    'lifestyle',
    'entertainment',
    'world',
    'opinion'
  ];
  model.cityWeather = 'Los Angeles';
  model.getWeather = (city) => {
    if (city == '') city = 'Los Angeles';
    articleService.getWeather(city)
      .then(function(res) {
        model.weatherObj = {
          max: Math.floor((res.main.temp_max-273)*(9/5)+32),
          min: Math.floor((res.main.temp_min-273)*(9/5)+32),
        }
        model.cityWeather = res.name;
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
  }

  model.$onInit = () => {
    model.getWeather(model.cityWeather);
  }

  model.timeNow = new Date();
  model.searchShow = false;
  model.showSearch = () => {
    model.searchShow = !model.searchShow;
  }
  model.editShow = false;
  model.showEdit = () => {
    model.editShow = !model.editShow;
  }
}

angular.module('newsApp').component('topMenu', {
  templateUrl: './components/header/header.html',
  controllerAs: 'model',
  controller: ['articleService', topMenuCtrl]
});
