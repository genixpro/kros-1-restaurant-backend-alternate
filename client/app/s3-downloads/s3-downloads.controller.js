'use strict';

angular.module('newsApp')
  .controller('S3DownloadsListCtrl', [
    '$scope', '$rootScope', '$http', 'S3Downloads', 'CatalogueCategories', '$log',
    '$translate', '$stateParams', '$state',

    function ($scope, $rootScope, $http, S3Downloads, $log,
              $translate, $stateParams, $state) {

      $scope.rec_per_page = [3, 5, 10, 25, 50, 100];
      $scope.limit = $scope.rec_per_page[0];
      $scope.totalPages = '';
      $scope.fetchFilteredRecords = fetchFilteredRecords;

      fetchFilteredRecords(1, $scope.limit);

      var listUpdatedListener = $rootScope.$on('list_updated', function () {
        fetchFilteredRecords();
      });
      $scope.$on('$destroy', listUpdatedListener);

      $scope.filteringBySearch = function () {
        $scope.currentPage=1;
        fetchFilteredRecords();
      };

      $scope.goToPage = function (page) {
        fetchFilteredRecords(page, $scope.limit, $scope.search);

      };

      function fetchFilteredRecords(_page, _limit, _search) {
        if (!_search) _search = $scope.search;
        if (!_limit) _limit = $scope.limit;
        if (!_page) _page = $scope.currentPage;

        S3Downloads.query({page: _page, limit: _limit, search: _search}).$promise.then(function (response) {
          $scope.totalPages = response.num_pages;
          $scope.currentPage = response.page;
          $scope.limit = response.page_size;
          $scope.s3Downloads = response.result;
        });
      }

    }
  ]);

angular.module('newsApp')
  .controller('S3DownloadsItemCtrl', [
    '$scope', '$rootScope', '$http', 'S3Downloads', 'CatalogueCategories', '$log',
    '$translate', '$stateParams', '$state', 'modalDeleteItem',

    function ($scope, $rootScope, $http, S3Downloads, CatalogueCategories, $log,
              $translate, $stateParams, $state, modalDeleteItem) {

      $scope.deleteRecord = function (item) {
        modalDeleteItem.open(function () {
          // Get the record and delete the image associated to it
          S3Downloads.delete({id: item._id}).$promise
            .then(function (response) {
              $rootScope.$emit('list_updated');
              $state.transitionTo('s3downloads', {
                reload: true
              });
            })

            .catch(function (error) {
              $log.error('Failed to delete record', error);
            });
        });
      };

    }
  ]);


angular.module('newsApp')
  .controller('S3DownloadsFormCtrl', [
    '$scope', '$rootScope', '$http', 'S3Downloads', 'CatalogueCategories', '$log',
    '$translate', '$stateParams', '$state',

    function ($scope, $rootScope, $http, S3Downloads, CatalogueCategories, $log,
              $translate, $stateParams, $state) {
      if ($state.current.url === '/add') {
        $scope.disabledForm = false;
        $scope.data = {
          productId: '',
          name: '',
          demo: '',
          wiki: '',
          info: '',
          s3_keys: []
        };
      } else {
        $state.current.url === '/:id/edit' ? $scope.disabledForm = false : $scope.disabledForm = true;

        S3Downloads.get({id: $stateParams.id}).$promise.then(function (result) {
          $scope.data = result;

        }).catch(function (error) {

        });

      }

      $scope.addS3KeysInputs = function () {
        if ($scope.disabledForm) return;
        $scope.data.s3_keys.push({
          isLatest: false,
          version: '',
          key: '',
          updateInstructions: ''
        });

      };

      $scope.removeS3KeysInputs = function (index) {
        $scope.data.s3_keys.splice(index, 1);
      };

      $scope.save = function () {
        if (!$scope.elementForm.$valid) {
          return;
        }

        if ($state.current.url === '/add') {
          createItem();
        } else {
          updateItem();

        }
      };

      $scope.checkLatest = function (index) {
        if (!$scope.data.s3_keys[index].isLatest) return;
        $scope.data.s3_keys.forEach(function (item, ind) {
          if (ind === index) return;
          item.isLatest = false;
        });

      };

      $scope.edit = function (record) {
        if (record) {
          $scope.data = record;
        }
        $scope.disabledForm = false;
        $state.go('s3downloads.update', {id: $scope.data._id});
      };


      function createItem() {

        S3Downloads.create($scope.data).$promise
          .then(function (result) {
            $rootScope.$emit('list_updated');
            $state.transitionTo('s3downloads', {
              reload: true
            });

          }).catch(function (response) {
          $log.error('failed to add photo', response);
        });

      }

      function updateItem() {
        S3Downloads.update($scope.data._id, $scope.data).$promise
          .then(function (result) {
            $scope.data = result;
            $rootScope.$emit('list_updated');
            // notify the listener when the list is updated
            $state.transitionTo('s3downloads.details', {
              id: result._id
            });

          }).catch(function (response) {

        });
      }


    }]);

