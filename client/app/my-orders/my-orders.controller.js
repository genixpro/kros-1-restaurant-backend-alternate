angular.module('newsApp')
  .controller('MyOrdersListCtrl', [ '$scope', '$rootScope', '$location', '$state', '$modal', '$log', 'paginator', 'PlatformOrders', '$translate', '$stateParams', 
    function ($scope, $rootScope, $location, $state, $modal, $log, paginator, PlatformOrders, $translate, $stateParams) {
      var firstPage = 1; // get the 1st page
      $scope.data = {
        orders: []
      };
      // pagination
      $scope.pagination = {
        next: false,
        previous: false,
        page: 1,
        pageSize: 0,
        total: 0,
        numPages: 0
      };
        
      $scope.paginator = paginator;
      $scope.fetchPlarformOrders = function(page) {
        PlatformOrders.getByEmail({page: page}).$promise.then(function(response) {
          $scope.data.orders = response.result
          paginator.setPage(response.page);
          paginator.setPages(response.num_pages);
          paginator.setPrevious(response.page === firstPage);
          paginator.setNext(response.page === response.num_pages);
        })
      }
      
      $scope.fetchPlarformOrders(firstPage)
      $scope.previousPage = function() {
        $scope.fetchPlarformOrders(paginator.getPage() - 1)
      };

      $scope.nextPage = function() {
        $scope.fetchPlarformOrders(paginator.getPage() + 1)
      };
      
      var listUpdatedListener = $rootScope.$on('list_updated', function() {
        $scope.fetchPlarformOrders($scope.pagination.page)
      });
      
      $scope.$on('$destroy', listUpdatedListener);
      $(window).trigger('resize');
      $scope.changeLanguage = function(key) {
        $translate.use(key);
      };
    }
  ])


angular.module('newsApp')
  .controller('MyOrdersDetailsCtrl', ['$scope', '$stateParams',
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
  ])

