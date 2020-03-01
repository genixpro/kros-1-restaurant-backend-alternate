'use strict';

angular.module('newsApp')
    .controller('TimeSlotItemCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {

      /**
       * Remove question inputs by the element index
       */

      $scope.opened = [];
      $scope.opened1 = [];
      $scope.removeTimeSlot = function(index) {

        $scope.data.model.availability.splice(index, 1);
      };


      $scope.open = function($event, idx) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened[idx] = true;
      };

      $scope.open1 = function($event, idx) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1[idx] = true;
      };

      $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };

      $scope.getDay = function(t){
        var dt = new Date(t);

        dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
        dt.setMinutes(dt.getMinutes() + window.moment.tz(dt, $rootScope.timezone).utcOffset());
//        t = window.moment.tz(t, $rootScope.timezone).utcOffset();
        var day = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        return day.getTime()
      }
    }]);