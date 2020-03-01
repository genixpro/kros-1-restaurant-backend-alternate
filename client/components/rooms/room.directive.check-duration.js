'use strict'

/**
 * @class angular_module.newsApp.checkDuration
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs directive.
 * form validation for availability, comparing dates availability.startDate and availability.endDate
 *
 */
angular.module('newsApp')
    .directive('checkDuration', function() {
      return {
        restrict:'A',
        require: 'ngModel',
        scope: {
          availability: '=availability'
        },
        link: function(scope, elm, attrs, ctrl) {
          var _checkDuration = checkDuration;

          ctrl.$parsers.push(_checkDuration);

          function checkDuration(e) {
            var  duration = e * 60 * 1000;

            scope.availability.forEach(function(el, index){
                el.startDate = el.startDate *1;
                el.endDate = el.endDate *1;

              if (el.endDate > el.startDate + duration) {
                delete scope.$parent.addForm.$error['availability'+index];
              } else {
                ctrl.$setValidity('availability'+index, false);
              }
            })
            return e;
          }
        }
      };
    });
