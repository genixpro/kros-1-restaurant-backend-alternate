'use strict';

angular.module('newsApp')
    .controller('SidebarCtrl', function($scope, $rootScope, $location, Auth, $translate, $log, ApplicationsManager, User, ENV, $state) {
      $scope.currentUser = Auth.getCurrentUser();

      $scope.isAdmin = Auth.isAdmin;
      $scope.path = $location.path();

      $scope.applications = ApplicationsManager.applications;
      $scope.applications.$promise.then(selectDefaultApplication);

      function selectDefaultApplication(applications) {
        if (!$scope.currentUser.selectedApplication) {
          var app = _.find(applications, function(item) {
            return item.type === ENV.defaultApplication;
          }) || applications[0];
          if (app) {
            selectApplication(app._id);
          }
        }
      }

      function selectApplication(appId) {
        if (appId) {
          $scope.currentUser.selectedApplication = appId;
          $rootScope.$emit('app:selected');
          $state.reload();
        }
      }

      var groups = [];
      groups['/']                     = 'dashboard';
      groups['/downloads']            = 'downloads';
      groups['/applications']         = 'applications';
      groups['/lectures']             = 'lectures';
      groups['/restaurant-orders']    = 'restaurant-orders';
      groups['/articles']             = 'articles';
      groups['/categories']           = 'menu';
      groups['/items']                = 'menu';
      groups['/offers']               = 'menu';
      groups['/grades']               = 'lectures-group';
      groups['/courses']              = 'lectures-group';
      groups['/topics']               = 'lectures-group';
      groups['/lectures']             = 'lectures-group';
      groups['/quizzes']              = 'lectures-group';
      groups['/reviews']              = 'restaurant';
      groups['/push']                 = 'push';
      groups['/business']             = 'account';
      groups['/photos']               = 'account';
      groups['/invoice']              = 'account';
      groups['/contact']              = 'account';
      groups['/admin']                = 'admin';
      groups['/rooms-split']          = 'posters';
      groups['/posters']              = 'posters';
      groups['/posters-simple']       = 'posters';
      groups['/posters-advanced']     = 'posters';
      groups['/monitors']             = 'posters';
      groups['/schedule']             = 'posters';
      groups['/calendar']             = 'posters-advanced';
      groups['/rooms']                = 'posters-advanced';
      groups['/upload-csv']           = 'posters-advanced';
      groups['/export-csv']           = 'posters-advanced';
      groups['/clients']              = 'posters-advanced';
      groups['/push']                 = 'posters-advanced';
      groups['/applications']         = 'posters-advanced';
      groups['/backup-restore']       = 'backup-restore';
      groups['/platform-orders']      = 'platform-orders';
      groups['/my-orders']            = 'my-orders';
      groups['/businesses-info']      = 'business';
      groups['/businesses-photos']    = 'business';
      groups['/businesses-invoice']   = 'business';
      groups['/businesses-contact']   = 'business';
      groups['/restaurant-advanced']  = 'restaurant';
      groups['/applications']         = 'restaurant-advanced';
      groups['/clients']              = 'restaurant-advanced';
      groups['/simple-lists']         = 'catalogue-products';
      groups['/catalogue-categories'] = 'catalogue-products';
      groups['/products']             = 'catalogue-products';
      groups['/reports']              = 'reports';
      groups['/reports/all']          = 'reports';
      groups['/reports/confirmed']    = 'reports';
      groups['/reports/non-confirmed']  = 'reports';
      groups['/submissioncodes-orders'] = 'submissioncode';
      groups['/my-downloads']    = 'submissioncode';

      $scope.isItemActive = function(item){
        var basepath = $location.path().split('/')[1];
        return basepath === item;
      };

      $scope.isGroupActive = function(group) {
        var basepath = '/' + $location.path().split('/')[1];
        return groups[basepath] === group;
      };

      /**
       * Listen to change language click event
       */
      $scope.onChangeLanguage = function(key) {
        $translate.use(key);
      };

      $scope.selectApplication = function() {
        // event for notifying when selected app changed
        $rootScope.$emit('app:selected');
        $state.reload();
      };
    });
