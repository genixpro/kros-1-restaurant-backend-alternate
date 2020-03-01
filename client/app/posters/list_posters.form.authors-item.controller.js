
'use strict';

angular.module('newsApp')
    .controller('AuthorsItemCtrl', ['$scope', function($scope) {

      /**
       *  @function removeAuthors
       *  @descriptionRemove question inputs by the element index
       */
      $scope.removeAuthors = function(index) {
        $scope.data.model.authors.splice(index, 1);
      };

      /**
       *  @function changeIsCorresponding
       *  @description in the selection of any author - 'isCorresponding', removes value 'isCorresponding' of all the other authors.
       *  (only one isCorresponding)
       *
       *  @param index - index of the selected author
       *  @param value - selected value
       */
      $scope.changeIsCorresponding = function(index, value){
        if(!value) return;
        $scope.data.model.authors.forEach(function(author, elIndex){
          if(elIndex == index){
            author.isCorresponding = true;
          } else {
            author.isCorresponding = false;
          }
        })
      };

      /**
       *  @function changeIsPresenter
       *  @description in the selection of any author - 'isPresenter', removes value 'isPresenter' of all the other authors.
       *  (only one isPresenter)
       *
       *  @param index - index of the selected author
       *  @param value - selected value
       */
      $scope.changeIsPresenter = function(index, value){
        if(!value) return;
        $scope.data.model.authors.forEach(function(author, elIndex){
          if(elIndex == index){
            author.isPresenter = true;
          } else {
            author.isPresenter = false;
          }
        })
      };
    }]);