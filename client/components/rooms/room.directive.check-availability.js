'use strict'

/**
 * @class angular_module.newsApp.checkAvailability
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs directive.
 * form validation for availability, comparing dates availability.startDate and availability.endDate
 *
 */
angular.module('newsApp')
    .directive('checkAvailability', function() {
  return {
    restrict:'A',
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var _checkAvailability = checkAvailability;

      ctrl.$parsers.push(_checkAvailability);
      ctrl.$formatters.push(_checkAvailability);


      function checkAvailability(e) {
        var startDate= attrs['availabilityStartDate']
            , endDate= attrs['availabilityEndDate']
            , index= attrs['availabilityIndex']
            , duration = attrs['availabilityDuration']
            , r = new RegExp("\x22+","g")
            , start
            , end;

        duration = duration * 60 * 1000;
        startDate = startDate ? startDate.replace(r, "") : e;
        endDate = endDate ? endDate.replace(r, "") : e;

        if(startDate*1) {
          start=startDate*1
        }else{
          start=new Date(startDate);
          start=start.getTime()
        }
        if(endDate*1) {
          end=endDate*1
        }else{
          end=new Date(endDate);
          end = end.getTime()
        }

        if (end>start + duration) {
          delete scope.$parent.$parent.addForm.$error['availability'+index];
          return e;
        } else {
          ctrl.$setValidity('availability'+index, false);
          return e;
        }
      }
    }
  };
});
