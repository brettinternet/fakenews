function worldMapCtrl(articleService) {
  let model = this;

  model.setupMap = (arr) => {
    console.log(arr);
    var map = new L.map('flat_earth_div');
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
        // maxZoom: 18,
        // id: '',
        // accessToken: 'pk.eyJ1IjoiYnJldHRpbnRlcm5ldCIsImEiOiJjaXhrcXl2bDUwMDRrMnducWQxYnE2cGJ6In0.EnmG2JKxi_5aTOhMzTCozw'
      }).addTo(map);

    arr.forEach((i) => {
      var marker = L.marker([i.lat,i.long]).addTo(map);
      marker.bindPopup("<a href='#/"+i.category+"/"+i.id+"'><b>"+i.title+"</b></a><br><span style='text-transform: capitalize;'>"+i.city+"</span>", {maxWidth: 150, closeButton: true});
    });

    map.setView([arr[0].lat,arr[0].long], 1.5);
  }

  model.$onInit = function() {
    articleService.getArticlesLoc()
      .then(function(res) {
        let arr = res.filter((i) => {
          return i.lat && i.long;
        });
        model.setupMap(arr);
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
  }

}

angular.module('newsApp').component('worldMap', {
  templateUrl: './components/worldMap/worldMap.html',
  controllerAs: 'model',
  controller: ['articleService', worldMapCtrl]
});
