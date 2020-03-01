'use strict';

angular.module('newsApp')
  // http://blog.brunoscopelliti.com/angularjs-directive-to-check-that-passwords-match/
  .directive('pwCheck', [function () {
      return {
        require: 'ngModel',
        link: function (scope, elem, attrs, ctrl) {
          var firstPassword = '#' + attrs.pwCheck;
          elem.add(firstPassword).on('keyup', function () {
            scope.$apply(function () {
              var v = elem.val()===$(firstPassword).val();
              ctrl.$setValidity('pwmatch', v);
            });
          });
        }
      }
    }])
  .controller('SignupCtrl', function($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};


    $scope.$watch('form', function(theForm) {
      if(theForm) {          
          theForm['passwordRetype'].$setValidity("passwordMatch",$scope.user.password==$scope.user.passwordRetype);
      }
      else {
          $scope.formDebugText = 'Form is Undefined';
      }
    });

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
          .then(function(user) {
            // Account created, redirect to home
            // $location.path('/');
            Auth.logout();
            $location.path('/login');
          })
          .catch(function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    };

    $(window).trigger('resize');

  });
