'use strict';

angular.module('newsApp')
  .directive('tiApp', function ($log, Auth, ApplicationsManager) {
    return {
      restrict: 'EA',
      scope: {
        appTypes: '@tiApp'
      },
      link: function (scope, element) {
        // get this directive app types
        var appTypes = scope.appTypes.split(',');
        if (!appTypes) {return;}

        // get current user selected app
        scope.currentUser = Auth.getCurrentUser();
        ApplicationsManager.applications.$promise.then(function (applications) {
          // watch for selected app change
          scope.$watch('currentUser.selectedApplication', function (newValue, oldValue) {
            var selectedApp = _.find(applications, {_id: newValue});
            var selectedAppType = selectedApp ? selectedApp.type : '';

            // compare selected type with directive app types
            if (!_.contains(appTypes, selectedAppType)) {
              element.hide();
            }
            else {
              element.show();
            }
          });
        });
      }
    };
  });
