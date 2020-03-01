'use strict';

angular.module('newsApp')
  .controller('DownloadsListCtrl', ['$scope', '$rootScope', '$http',
    '$location', 'paginator', 'Downloads', '$log', '$translate',
    function($scope, $rootScope, $http, $location, paginator, Downloads, $log, $translate) {
      
      $scope.data = {
        records: []
      };
      
      // fetch the records
      $scope.fetchDownloads = function() {
        $scope.data.records = Downloads.query()
        console.log('$scope.data.records', $scope.data.records)
        
      };

      $scope.fetchDownloads();
      
      // listen for app selection
      $rootScope.$on('app:selected', function() {
        $scope.fetchDownloads();
      });
      
      // listen to hide records list update event
      var listUpdatedListener = $rootScope.$on('list_updated',
        function() {
          $scope.fetchDownloads();
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
  .controller('DownloadsItemCtrl', ['$scope', '$log',
    'modalDeleteItem', 'Downloads', 'Media', '$state',
    function($scope, $log, modalDeleteItem, Downloads, Media, $state) {
    
      /**
       * Delete category item from the list
       */
      $scope.deleteDownload = function(download) {
        modalDeleteItem.open(function() {
          // Get the record and delete the image associated to it
          download.$delete()
          $state.transitionTo('downloads', {}, {
            reload: true
          });
        });
      };
    
    
    
    }
  ]);
  
  
angular.module('newsApp')
  .controller('DownloadsAddFormCtrl', ['$scope', 'Downloads',
    '$log', '$timeout', '$state', 
    function($scope, Downloads, $log, $timeout, $state) {
    
    
      $scope.ui = {};
      $scope.ui.inProgress = false;
    
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }
    
      $scope.data = {
        model: {
          s3Keys: []
        }
      };
    
      $scope.addOptionInputs = function(index) {
        var item = {
          version: '',
          key: '',
          updateInstructions: '',
          isLatest: false
        };
        $scope.data.model.s3Keys.push(item);
      };
      
      $scope.removeOptionInputs = function(index) {
        $scope.data.model.s3Keys.splice(index, 1);
      };
      
      $scope.save = function() {
        progressStart()
        
        
        function saveCategory() {
          var newDownload = new Downloads($scope.data.model);
          newDownload.$save(function() {
            // notify the listener when the category is added
            $scope.$emit('list_updated');
            // display the updated form
            $state.transitionTo($state.current, {}, {
              reload: true
            });
          }, function(err) {
            $log.error('failed to add download');
          })
        }
        saveCategory()
      }
    }
  ]);
  
  
angular.module('newsApp')
  .controller('DownloadsUpdateFormCtrl', [
    '$scope', '$rootScope', 'Downloads', '$log',
    '$stateParams', '$state', '$location',
    function($scope, $rootScope, Downloads, $log, $stateParams,
      $state, $location) {
      console.log('DownloadsUpdateFormCtrl')
      
      
      $scope.data = {
        model: {
          s3Keys: []
        }
      };
      
      $scope.ui = {};
      $scope.ui.inProgress = false;
      
      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }
      
      // fetch single document
      
      Downloads.get({id: $stateParams.id}).$promise.then(function(response) {
        $scope.data.model = response;
      })
      
      
      $scope.addOptionInputs = function(index) {
        var item = {
          version: '',
          key: '',
          updateInstructions: '',
          isLatest: false
        };
        $scope.data.model.s3Keys.push(item);
      };
      
      $scope.removeOptionInputs = function(index) {
        $scope.data.model.s3Keys.splice(index, 1);
      };
      
      
      $scope.update = function() {
        if (!$scope.updateForm.$valid) {
          return;
        }
        progressStart();
        var toBeUpdateDownloadId = $scope.data.model._id;
        
        function saveDownload() {
          $scope.data.model.$update(
            function() {
              progressEnd();
              $rootScope.$emit('list_updated');
              $state.transitionTo('downloads.details', {
                id: toBeUpdateDownloadId
              }, {
                reload: true
              });
            },
            function(error) {
              $log.error('error', error);
              progressEnd();
            }
          )
        }
        saveDownload()
      };

    }
  ]);
      
      
  
angular.module('newsApp')
  .controller('DownloadsDetailsCtrl', ['$scope', '$stateParams',
    'Downloads',
    function($scope, $stateParams, Downloads) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      // fetch single category
      Downloads.get({id: $stateParams.id}).$promise.then(function(response) {
        $scope.data.model = response;
      })

    }
  ]);
