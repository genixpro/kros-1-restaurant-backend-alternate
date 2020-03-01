'use strict';

angular.module('newsApp')
  .directive('dashboardCatalogue', function () {
    return {
      restrict: 'E',
      transclude: true,
      templateUrl: 'app/main/catalogue/catalogue.main.html',
      scope: {},
      controller: function($scope, $filter) {
        console.log('Dashboard catalogue controller');

        $scope.dateDay = $filter('date')(new Date(), 'EEE');
        $scope.dateShort = $filter('date')(new Date(), 'MMMM d, y');
      }
    }

  })
