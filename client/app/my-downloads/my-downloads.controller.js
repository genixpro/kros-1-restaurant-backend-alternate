'use strict';

angular.module('newsApp')
  .controller('MyDownloadsListCtrl', ['$scope', '$rootScope', '$http',
    '$location', 'paginator', 'SubmissioncodesOrders', 'Auth', '$log', '$translate',
    function ($scope, $rootScope, $http, $location, paginator, SubmissioncodesOrders, Auth, $log, $translate) {
      var currentUser = Auth.getCurrentUser();
      $scope.fetchData = fetchSubmissioncodesDownloads;
      fetchSubmissioncodesDownloads();

      //get User, getAll user emails
      function fetchSubmissioncodesDownloads(_page, _limit, _search) {
        if (!_search) _search = $scope.search;
        if (!_limit) _limit = $scope.limit;

        SubmissioncodesOrders.getByEmail({
          email: currentUser.email
        }).$promise.then(function (response) {
          // $scope.setPager(response);
          $scope.data = response.result;
          //num_pages
          $scope.totalPages = response.total;
          $scope.currentPage = response.page;

        });
      }
    }]);


angular.module('newsApp')
  .controller('MyDownloadsDetailsCtrl', ['$scope', '$rootScope', '$http',
    '$location', 'paginator', 'SubmissioncodesOrders', 'Auth', '$stateParams', '$log', '$translate', 'S3Downloads',
    function ($scope, $rootScope, $http, $location, paginator, SubmissioncodesOrders, Auth, $stateParams, $log, $translate, S3Downloads) {

      SubmissioncodesOrders.get({id: $stateParams.id}).$promise.then(function (response) {
        $scope.data = response;
        if ($scope.data.additionalEmails && $scope.data.additionalEmails.length) {
          $scope.data.additionalEmails = $scope.data.additionalEmails.map(function (d) {
            return {
              val: d
            };
          });
        }
        S3Downloads.query({productId: response.productId}).$promise.then(function (resp) {
          $scope.data.s3_keys = resp[0].s3_keys;
          $scope.data.productName = resp[0].name;
        });
      });

    }]);
