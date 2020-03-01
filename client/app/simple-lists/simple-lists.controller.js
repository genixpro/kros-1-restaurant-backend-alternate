'use strict';

angular.module('newsApp')
  .controller('SimpleListsListCtrl', [
    '$scope', '$rootScope', 'SimpleLists', '$translate',

    function($scope, $rootScope, SimpleLists, $translate) {

      $scope.data = {
        records: []
      };

      // fetch the records
      $scope.fetchLists = function() {
        $scope.data.records = SimpleLists.query();
      };

      $scope.fetchLists();

      // listen for app selection
      $rootScope.$on('app:selected', function() {
        $scope.fetchLists();
      });

      // listen to hide records list update event
      var listUpdatedListener = $rootScope.$on('list_updated',
        function() {
          $scope.fetchLists();
        });

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');

      $scope.changeLanguage = function(key) {
        $translate.use(key);
      };
    }
  ]);

angular.module('newsApp')
  .controller('SimpleListsItemCtrl', [
    '$scope', '$log', 'modalDeleteItem', 'SimpleLists', '$state',

    function($scope, $log, modalDeleteItem, SimpleLists, $state) {

      /**
       * Delete category item from the list
       */
      $scope.delete = function(item) {
        modalDeleteItem.open(function() {
          // Get the record and delete the image associated to it
          $scope.record = item;
          $scope.record.$delete();
          $state.transitionTo('simpleLists', {}, {
            reload: true
          });
        });
      };
    }
  ]);

angular.module('newsApp')
  .controller('SimpleListsAddFormCtrl', [
    '$scope', 'SimpleLists', '$log', '$state',

    function($scope, SimpleLists, $log, $state) {

      $scope.data = {
        // The model the contols are binded to.
        // Its fields are coresponding to our record fields
        model: { }
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      /*jshint unused: false */
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }
      /*jshint unused: true */

      /*
       * Handle the add form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) {
          return;
        }

        progressStart();

        function _save() {
          // Get model
          var data = $scope.data.model;

          var item = new SimpleLists(data);
          item.$save(function() {
            // notify the listener when the category is added
            $scope.$emit('list_updated');
            // display the updated form
            $state.transitionTo($state.current, {}, {
              reload: true
            });
          }, function(err) {
            $log.error('failed to add photo');
          });
        }
        _save();
      }; //$scope.save
    }
  ]);

angular.module('newsApp')
  .controller('SimpleListsUpdateFormCtrl', [
    '$scope', '$rootScope', 'SimpleLists', '$log', '$stateParams', '$state',

    function($scope, $rootScope, SimpleLists, $log, $stateParams, $state) {

      $scope.data = {
        // The model the controllers are binded to.
        // Its fields are coresponding to our record fields
        model: {}
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      // fetch single document
      SimpleLists.get({id: $stateParams.id}).$promise.then(function(response) {
        $scope.data.model = response;
      });

      /*
       * Handle the form submission
       */
      $scope.update = function() {
        // if the form is not valid then cut the flow
        if (!$scope.updateForm.$valid) {
          return;
        }

        progressStart();

        var toBeUpdateCategoryId = $scope.data.model._id;

        function save() {

          console.log('$scope.data.model', $scope.data.model);

          $scope.data.model.$update(
            function() {
              progressEnd();
              // notify the listener when the category is added
              $rootScope.$emit('list_updated');
              // display the updated form
              $state.transitionTo('simpleLists.details', {
                id: toBeUpdateCategoryId
              }, {
                reload: true
              });
            },
            function(error) {
              $log.error('error', error);
              progressEnd();
            });
        }

        save();
      };
    }
  ]);

angular.module('newsApp')
  .controller('SimpleListsDetailsCtrl', [
    '$scope', '$stateParams', 'SimpleLists',

    function($scope, $stateParams, SimpleLists) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single category
      SimpleLists.get({id: $stateParams.id}).$promise.then(function(response) {
        $scope.data.model = response;
      });

    }
  ]);
