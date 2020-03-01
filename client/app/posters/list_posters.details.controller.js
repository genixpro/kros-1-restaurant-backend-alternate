'use strict'

/**
 * @class angular_module.newsApp.PostersDetailsCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * It shows details of the selected poster on the right of the template 'list poster'.
 * triggered after the click on the poster from the list on the right side of the 'list poster'
 *
 */
angular.module('newsApp')
  .controller('PostersDetailsCtrl', ['$scope', '$stateParams', 'Rooms', 'Posters', '$filter',

      /**
       * @function PostersCalendarCtrl
       *
       * @description all @params should be comply Injection Dependency
       *
       * @param $scope - angularjs $scope
       * @param $stateParams - angularjs $stateParams
       * @param Rooms - This is an angularjs service - angular_module.newsApp.Rooms.
       * @param Posters - This is an angularjs service - angular_module.newsApp.Posters.
       * @param $filter - angularjs filter
       *
       */
    function($scope, $stateParams, Rooms, Posters, $filter) {

      /**
       *  hold the details data
       */
      $scope.data = {
        model: {}
      };

      $scope.selects = {
        room : null,
        monitor : null,
        date : new Date()
      };
        /**
         *  fetch single page
         */
      Posters.get({id : $stateParams.id}).$promise.then(function(response) {
        var body = response;
        $scope.data.model = body;
        $scope.selects.date = $scope.data.model.startDate;
        $scope.selects.startTime = $scope.data.model.startDate;
        /**
         * Calculate the endDate/time
         */
        var endTime = null;
        if ($scope.data.model.startDate){
          endTime = $scope.data.model.startDate + $scope.data.model.duration * 60 * 1000;
        }

        $scope.selects.endTime = endTime;

        $scope.selects.authors = $scope.data.model.authors;
        if (!$scope.data.model.room) return
        Rooms.get({id : $scope.data.model.room }).$promise.then(function(res) {
          $scope.selects.room = res;
          $scope.selects.monitor = $scope.selects.room.monitors[$scope.data.model.monitor];
        });

      });
    }
  ]);
