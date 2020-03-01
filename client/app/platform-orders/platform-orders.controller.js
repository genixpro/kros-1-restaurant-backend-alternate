'use strict';

angular.module('newsApp')
  .controller('PlatformOrdersListCtrl', ['$scope', '$rootScope', '$http',
    '$location', 'paginator', 'PlatformOrders', '$log', '$translate',
    function($scope, $rootScope, $http, $location, paginator, PlatformOrders, $log, $translate) {
    
      $scope.data = {
        records: []
      };
      
      // fetch the records
      $scope.fetchPlatformOrders = function() {
        $scope.data.records = PlatformOrders.query()
      };

      $scope.fetchPlatformOrders();
      // listen to hide records list update event
      var listUpdatedListener = $rootScope.$on('list_updated',
        function() {
          $scope.fetchPlatformOrders();
        });

      // unregister the listener to avoid memory leak
      $scope.$on('$destroy', listUpdatedListener);

      $(window).trigger('resize');

      $scope.changeLanguage = function(key) {
        $translate.use(key);
      };
    
    }
  ]
)
  
angular.module('newsApp')
  .controller('PlatformOrdersItemCtrl', ['$scope', '$log',
    'modalDeleteItem', 'PlatformOrders', '$state',
    function($scope, $log, modalDeleteItem, PlatformOrders, $state) {
    
      $scope.deletePlatformOrder = function(platformOrder) {
        modalDeleteItem.open(function() {
          // Get the record and delete the image associated to it
          platformOrder.$delete()
          $state.transitionTo('platform_orders', {}, {
            reload: true
          });
        });
      }
    
    }
  ]
)

angular.module('newsApp')
  .controller('PlatformOrdersAddFormCtrl', ['$scope', 'PlatformOrders',
    '$log', '$timeout', '$state', 
    function($scope, PlatformOrders, $log, $timeout, $state) {
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
          purchaseDate: {
            date: ''
          },
          additionalEmails: [],
          quantity: 1
        }
      };
      
      $scope.isOpen = false;
    
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      }
    
    
    
      $scope.addOptionInputs = function(index) {
        $scope.data.model.additionalEmails.push({val: ""});
      };
      
      $scope.removeOptionInputs = function(index) {
        $scope.data.model.additionalEmails.splice(index, 1);
      };
      
      $scope.save = function() {
        progressStart()
        function savePlatformOrder() {
          var newPlatformOrder = new PlatformOrders($scope.data.model);
          newPlatformOrder.additionalEmails = newPlatformOrder.additionalEmails.map(function(d) {
            return d.val
          })
          newPlatformOrder.$save(function() {
            // notify the listener when the category is added
            $scope.$emit('list_updated');
            // display the updated form
            $state.transitionTo($state.current, {}, {
              reload: true
            });
          }, function(err) {
            $log.error('failed to add platform order');
          })
        }
        savePlatformOrder()
      }
    
    }
  ]
)

angular.module('newsApp')
  .controller('PlatformOrdersUpdateFormCtrl', [ '$scope', '$rootScope', 'PlatformOrders', '$log',
    '$stateParams', '$state', '$location',
    function($scope, $rootScope, PlatformOrders, $log, $stateParams,
      $state, $location) {
      
      $scope.data = {
        model: {
          purchaseDate: {
            date: ''
          },
          additionalEmails: [],
          quantity: 1
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
      $scope.isOpen = false;
    
      $scope.openCalendar = function(e) {
        e.preventDefault();
        e.stopPropagation();
        $scope.isOpen = true;
      }
      
      // fetch single document
      PlatformOrders.get({id: $stateParams.id}).$promise.then(function(response) {
        $scope.data.model = response;
        if ($scope.data.model.additionalEmails && $scope.data.model.additionalEmails.length) {
          $scope.data.model.additionalEmails = $scope.data.model.additionalEmails.map(function(d) {
            return {
              val: d
            }
          })
        }
      })
      
      $scope.addOptionInputs = function(index) {
        $scope.data.model.additionalEmails.push({val: ""});
      };
      
      $scope.removeOptionInputs = function(index) {
        $scope.data.model.additionalEmails.splice(index, 1);
      };
      
      $scope.update = function() {
        if (!$scope.updateForm.$valid) {
          return;
        }
        progressStart();
        var toBeUpdateDownloadId = $scope.data.model._id;
        
        function savePlatformOrder() {
          $scope.data.model.$update(
            function() {
              progressEnd();
              $rootScope.$emit('list_updated');
              $state.transitionTo('platform_orders.details', {
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
        savePlatformOrder()
      };
      
    }
  ]
)
      
      
angular.module('newsApp')
  .controller('PlatformOrdersDetailsCtrl', ['$scope', '$stateParams',
    'PlatformOrders',
    function($scope, $stateParams, PlatformOrders) {
    
      $scope.data = {
        model: {}
      };

      // fetch single category
      PlatformOrders.get({id: $stateParams.id}).$promise.then(function(response) {
        $scope.data.model = response;
      })
    
    }
  ]
)
      
