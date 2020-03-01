'use strict'

/**
 * @class angular_module.newsApp.PostersItemCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * deletes the chosen poster from the posters list
 *
 */
angular.module('newsApp')
  .controller('PostersItemCtrl', ['$scope', 'modalDeleteItem', 'Posters', '$state',
      /**
       * @function PostersItemCtrl
       *
       * @description all @params should be comply Injection Dependency
       *
       * @param $scope - angularjs $scope
       * @param modalDeleteItem - angularjs service angular_module.newsApp.modalDeleteItem
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       * @param $state - angularjs $state
       */
    function($scope,  modalDeleteItem, Posters, $state) {

      /**
       *  @function deleteItem
       *  @description Delete item from the list
       *
       *  @param {Object} record - poster, which is going to remove
       */
      $scope.deleteItem = function(record) {
        modalDeleteItem.open(function() {
          Posters.delete({id : record._id}).$promise.then(function onSuccess(response) {
            // reload the list view
            $state.transitionTo('posters', {}, {
              reload: true
            });
          }, function onError(response) {
            console.log('An error occured while deleting record ', response);
          });
        });
      };
    }
  ]);
