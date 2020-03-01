'use strict';

angular.module('newsApp')
  .directive('dashboardRestaurant', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/main/restaurant/restaurant.main.html',
      scope: {},
      controller: function($scope, $filter) {
        console.log('Dashboard restaurant controller');

        $scope.dateDay = $filter('date')(new Date(), 'EEE');
        $scope.dateShort = $filter('date')(new Date(), 'MMMM d, y');
      }
    }

  })
