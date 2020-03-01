
'use strict';

angular.module('newsApp')
    .controller('RoomsDetailsCtrl', ['$scope', '$stateParams', 'Rooms', '$filter',
      function($scope, $stateParams, Rooms, $filter) {
        // hold the details data
        $scope.data = {
          model: {}
        };

        // fetch single page
        Rooms.get({id : $stateParams.id}).$promise.then(function(response) {
          var body = response;
          $scope.data.model = body;
        });
      }
    ]);