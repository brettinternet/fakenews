function landingCtrl(articleService) {
  let model = this;
  model.artbreak = [];
  let modifyResponse = (articles) => {
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].breakingnews) {
        let rem = articles.splice(i, 1)[0];
        model.artbreak.push(rem);
      }
    }
    model.articlesMore = articles.splice(3);
    model.slickOn = true;
  }
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
  }

  model.setupMap = (arr) => {
    var options = {
      // tilting: false,
      minAltitude: 300000,
      // maxAltitude: 100000000
    }
    var earth = new WE.map('earth_div', options);
    WE.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '© OpenStreetMap'
      }).addTo(earth);
    earth.setTilt(50);
    // earth.setHeading(300);

    arr.forEach((i) => {
      var marker = WE.marker([i.lat,i.long]).addTo(earth);
      marker.bindPopup("<a href='#/"+i.category+"/"+i.id+"'><b>"+i.title+"</b></a><br><span style='text-transform: capitalize;'>"+i.city+"</span>", {maxWidth: 150, closeButton: true});//.openPopup();
    });

    var before = null;
      requestAnimationFrame(function animate(now) {
        var c = earth.getPosition();
        var elapsed = before? now - before: 0;
        before = now;
        earth.setCenter([c[0], c[1] + 0.1*(elapsed/30)]);
        requestAnimationFrame(animate);
      });

    // earth.setView([arr[0].lat,arr[0].long], 4);
    earth.setView([37.089000, -138.533000], 1.5);
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
    model.category = 'front';
    articleService.getArticles(model.category)
      .then(function(res) {
        model.articles = res;
        modifyResponse(model.articles);
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
    articleService.getOtherArticles()
      .then(function(res) {
        for (var i = 0; i < res.length; i++) {
          if (res[i].breakingnews) {
            let rem = res.splice(i, 1)[0];
            model.artbreak.push(rem);
          }
        }
        model.slickOn = true;
        model.articlesOther = res;
        model.articlesOtherMore = model.articlesOther.splice(4);
        model.articlesOtherMore2 = model.articlesOtherMore.splice(4);
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
    articleService.getTagList(model.category)
      .then(function(res) {
        model.catTags = res;
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
    articleService.getPics(model.category)
      .then(function(res) {
        model.pics = res;
        model.picsMore = model.pics.splice(4);
        model.picsMore2 = model.picsMore.splice(3);
      })
      .catch(function(err) {
        model.error = err;
        console.error(err);
      });
  }
}

angular.module('newsApp').component('landing', {
  templateUrl: './components/landing/landing.html',
  controllerAs: 'model',
  controller: ['articleService', landingCtrl]
});
