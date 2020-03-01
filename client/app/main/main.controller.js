'use strict';

/**
 * @class angular_module.newsApp.MainCtrl
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs controller.
 * It loads the page dashboard
 *
 */
angular.module('newsApp')
  .controller('MainCtrl', ['$scope', '$filter', '$rootScope', 'PostersLintSummary', 'Auth', 'ApplicationsManager',

      /**
       * @function MainCtrl
       *
       * @param - It is the same as defined in the inject dependencies
       * @param $scope - angularjs $scope
       * @param $rootScope - angularjs $rootScope
       */
    function($scope, $filter, $rootScope, PostersLintSummary, Auth, ApplicationsManager) {

      $scope.currentUser = Auth.getCurrentUser()

      ApplicationsManager.applications.$promise.then(function (applications) {
        // watch for selected app change
        $scope.$watch('currentUser.selectedApplication', function (newValue, oldValue) {
          var selectedApp = _.find(applications, {_id: newValue});
          var selectedAppType = selectedApp ? selectedApp.type : '';
          $scope.selectedAppType = selectedAppType;
        });
      });

      $(window).trigger('resize');
    }
  ]);
