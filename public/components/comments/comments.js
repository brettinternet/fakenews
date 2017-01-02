function comments(articleService, $stateParams) {
  let model = this;
  let modifyResponse = (comments) => {
    for (var i = 0; i < comments.length; i++) {
      if (comments[i].country !== 'US') {
        comments[i].locCountry = comments[i].country;
      } else {
        comments[i].locState = comments[i].state;
      }
    }
  }
  model.$onInit = function() {
    articleService.getComments($stateParams.articleId)
      .then(function(res) {
        model.comments = res;
        modifyResponse(model.comments)
      })
      .catch(function(err) {
        $scope.error = err;
        console.error(err);
      })
  }
}


angular.module('newsApp').component('comments', {
  templateUrl: './components/comments/comments.html',
  controllerAs: 'model',
  controller: ['articleService', '$stateParams', comments]
});
