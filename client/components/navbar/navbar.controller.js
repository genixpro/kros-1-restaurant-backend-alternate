'use strict';

angular.module('newsApp')
  .controller('LogoutModalInstanceCtrl', [
    '$scope', '$modalInstance',
    function($scope, $modalInstance) {

      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

    }
  ]);


angular.module('newsApp')
  .controller('NavbarCtrl', function($scope, $location, $modal, $log, Auth, $rootScope, $state, $localStorage) {
    // $scope.menu = [{
    //   'title': 'Home',
    //   'link': '/',
    //   'fa': 'fa-home'
    // }];

    $scope.menu = [];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    // console.log($scope.isLoggedIn);

    // $scope.logout = function() {
    //   Auth.logout();
    //   $location.path('/login');
    // };
    $rootScope.timezone = $scope.timezone = $localStorage.timezone;
    $scope.changeTimezone = function () {
      $localStorage.timezone = $rootScope.timezone = $scope.timezone;
      $state.reload();
      console.log($scope.timezone);
    }

    $scope.logout = function() {

      var modalInstance = $modal.open({
        templateUrl: 'components/navbar/modal-logout.html',
        controller: 'LogoutModalInstanceCtrl',
        resolve: {

        }
      });

      modalInstance.result.then(
        function() {
          Auth.logout();
          $location.path('/login');
          // $location.path('/welcome');
        },
        function() {
          $log.info('Logout is aborted.');
        });

    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };

    function daysLeft(){
      var expiration = $scope.getCurrentUser().expiration;
      var now = Date.now();
      var days = (expiration - now) / 1000 / 60 / 60 / 24;

      return Math.ceil(days);
    }

    $scope.daysLeft = daysLeft();

    $scope.toggledays = function(){
      if ($scope.daysLeft === 70){
        $scope.daysLeft = 39;
      }else{
        $scope.daysLeft = 70;
      }
    }
  });
