'use strict';

angular.module('newsApp')
  .controller('ResetCtrl', function($scope, $stateParams, $timeout, $location, $log, Auth) {
    $scope.reset = function(form) {
      $scope.submitted = true;
      $scope.success = false;
      $scope.error = '';

      if(form.$valid && $scope.password == $scope.confirm) {
        Auth.reset({
          password: $scope.password,
          token: $stateParams.token
        })
          .then(function() {
            $scope.success = true;

            $timeout(function() {
              // CONFIG: Set the redirection URL after password reset
              $location.path('/login');
              // $location.path('/submissioncode');
              // $location.path('/welcome');
            }, 10000);
          })
          .catch(function(err) {
            $scope.error = err.message;
          });
      }
    };

    $(window).trigger('resize');
    $('body').css('backgroundColor', '#e8ebec');
  });
