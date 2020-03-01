'use strict';

var METHOD_TAKEAWAY    = 'METHOD_TAKEAWAY';
var METHOD_DELIVERY    = 'METHOD_DELIVERY';
var METHOD_DINEIN      = 'METHOD_DINEIN';

var STATUS_NEW_UNREAD  = 'STATUS_NEW_UNREAD';
var STATUS_NEW         = 'STATUS_NEW';
var STATUS_IN_PROGRESS = 'STATUS_IN_PROGRESS';
var STATUS_SHIPPED     = 'STATUS_SHIPPED';
var STATUS_DELIVERED   = 'STATUS_DELIVERED';
var STATUS_CANCELED    = 'STATUS_CANCELED';
var STATUS_ARCHIVED    = 'STATUS_ARCHIVED';

// This map is used only for the paramater displayed in the URL
var map = {};
map[STATUS_NEW_UNREAD]  = 'new-unread';
map[STATUS_NEW]         = 'new';
map[STATUS_IN_PROGRESS] = 'in-progress';
map[STATUS_SHIPPED]     = 'shipped';
map[STATUS_DELIVERED]   = 'completed';
map[STATUS_CANCELED]    = 'canceled';
map[STATUS_ARCHIVED]    = 'archived';

var backmap = _.invert(map)

angular.module('newsApp')
  .filter('statusDescriptor', [
    function() {
      return function(input) {
        return map[input];
      };
    }
  ]);

angular.module('newsApp')
  .filter('statusBackDescriptor', [
    function() {
      return function(input) {
        return backmap[input];
      };
    }
  ]);

angular.module('newsApp')
  .controller('RestaurantOrderPreviewModalInstanceCtrl', [
    '$scope', '$modalInstance', '$log', 'order',
    function($scope, $modalInstance, $log, order) {

      $scope.order = order;

      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

    }
  ]);

angular.module('newsApp')
  .filter('methodDescriptor', [
    function() {
      return function(input) {
        var map = {};

        map[METHOD_TAKEAWAY] = 'Take away';
        map[METHOD_DELIVERY] = 'Delivery';

        return map[input];
      };
    }

  ]);

angular.module('newsApp')
  .controller('RestaurantOrdersListCtrl', [ '$scope', '$rootScope', '$location', '$state', '$modal', '$log', 'paginator', 'RestaurantOrders', '$translate', '$stateParams', '$filter', '$interval', 'ngAudio',
  function ($scope, $rootScope, $location, $state, $modal, $log, paginator, RestaurantOrders, $translate, $stateParams, $filter, $interval, ngAudio) {

    $scope.sound = ngAudio.load("http://appseed.io.s3.amazonaws.com/public/sounds/ding-ling.mp3");


    var firstPage = 1; // get the 1st page

    $scope.data = {
      orders: [],
      refreshInterval: null
    };
    var updateTime = null;

    RestaurantOrders.getInterval().then(
      function success(res) {
        $scope.data.refreshInterval = +res.data.result
      },
      function error(res) {
        console.error('Interval response error received.', res);
      });

    function updateList () {
      $scope.$emit('list_updated');
    }

    $scope.$watch('data.refreshInterval', function(value) {
      if (updateTime) {
        $interval.cancel(updateTime);
      }
      else if (value) {
        updateTime = $interval(updateList, value*1000);
      }
    })

    $scope.statuses = [STATUS_NEW_UNREAD, STATUS_NEW, STATUS_IN_PROGRESS, STATUS_SHIPPED, STATUS_DELIVERED, STATUS_CANCELED, STATUS_ARCHIVED]

    $scope.changeselectedStatus = function() {
      var status = $scope.selectedStatus ? $filter('statusDescriptor')($scope.selectedStatus) : 'all'
      // var status = $scope.selectedStatus ? $scope.selectedStatus : 'all'
      if (status && status != $stateParams.status) {
        $state.transitionTo('restaurant_orders', {
          status: status
        }, {reload: false});
      }
    }

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

    var calculatePreparationTime = function (items) {
      return function () {
        var sum = 0;

        for(var i in items){
          sum = sum + items[i].preparationTime;
        }

        return sum;
      };
    };


    $scope.checkUnread = function () {
      var isUnread = false;
      $scope.data.orders.forEach(function (d) {
        if (d.status == "STATUS_NEW_UNREAD") {
          isUnread = true
        }
      })
      if (isUnread) {
        $scope.sound.play()
      }
    }

    $scope.fetchAllRestaurandOrfers = function(page) {
      // fetch the list
      RestaurantOrders.get(page).then(function(response) {
        var body = response.data;
        for (var i in body.result){
          var order = body.result[i];
          order.preparationTime = calculatePreparationTime(body.result[i].items);
        }
        $scope.data.orders = body.result;
        $scope.checkUnread()

        // set the pager
        paginator.setPage(body.page);
        paginator.setPages(body.num_pages);
        paginator.setPrevious(body.page === firstPage);
        paginator.setNext(body.page === body.num_pages);
      });
    }


    $scope.fetchItemsByStatus = function(page) {
      var status = $scope.selectedStatus;
      RestaurantOrders.getByStatus(page, status).then(function(response) {
        var body = response.data;
        for (var i in body.result){
          var order = body.result[i];
          order.preparationTime = calculatePreparationTime(body.result[i].items);
        }
        $scope.data.orders = body.result;
        $scope.checkUnread()
        // set the pager
        paginator.setPage(body.page);
        paginator.setPages(body.num_pages);
        paginator.setPrevious(body.page === firstPage);
        paginator.setNext(body.page === body.num_pages);
      });
    };

    $scope.selectStateStatus = function(page) {
      $scope.selectedStatus = $stateParams.status
      if ($stateParams.status == 'all') {
        $scope.selectedStatus = undefined;
        $scope.fetchAllRestaurandOrfers(page)
      }
      else {
        $scope.statuses.forEach(function(status) {
          if (status == $filter('statusBackDescriptor')($stateParams.status)) {
            $scope.selectedStatus = status;
          }
        })
        if ($scope.selectedStatus) {
          $scope.fetchItemsByStatus(page)
        }
      }

    };

    $scope.selectStateStatus(firstPage)

    /**
     * Browse the previous page of list
     */
    $scope.previousPage = function() {
      // fetch the list
      $scope.selectStateStatus(paginator.getPage() - 1)
    };

    /**
     * Browse the next page of list
     */
    $scope.nextPage = function() {
      $scope.selectStateStatus(paginator.getPage() + 1)
    };

    // listen to hide list update event
    var listUpdatedListener = $rootScope.$on('list_updated', function() {
      $scope.selectStateStatus($scope.pagination.page)
    });

    function update(index){
      RestaurantOrders.update( $scope.data.orders[index]._id,  $scope.data.orders[index]).then(function onSuccess(response) {
        console.log('response: %o', response);

        // notify the listener when the offer is added
        $scope.$emit('list_updated');

        $.notify('The order status has been updated.', {'status':'info'} || {});
        $scope.sendChangedStatusEmail(response.data.result)


      }, function onError(response) {
        $log.error('response', response);
      });
    }

    $scope.sendChangedStatusEmail = function (order) {
      RestaurantOrders.orderChangeStatusNotify(order.shipping.email, order.friendlyID, map[order.status])
    }

    $scope.preview = function(index) {

      var modalInstance = $modal.open({
        templateUrl: 'app/restaurant-orders/modal-preview.html',
        controller: 'RestaurantOrderPreviewModalInstanceCtrl',
        resolve: {
          order: function(){
            return $scope.data.orders[index];
          }
        }
      });

      modalInstance.result.then(
        function() {
          // $location.path('/orders/' + $scope.data.orders[index]._id + '?ref=print');
          $state.go('restaurant_orders.details', {'id': $scope.data.orders[index]._id, 'ref': 'back'});
        },
        function() {
          $log.info('Logout is aborted.');
        });

    };

    $scope.open = function(index){
      console.log('Mark order as completed: %o', $scope.data.orders[index]);
      $scope.data.orders[index].status = STATUS_NEW;

      update(index);
    };

    $scope.complete = function(index){
      console.log('Mark order as completed: %o', $scope.data.orders[index]);
      $scope.data.orders[index].status = STATUS_DELIVERED;

      update(index);
    };

    $scope.cancel = function(index){
      console.log('Mark order as canceled: %o', $scope.data.orders[index]);
      $scope.data.orders[index].status = STATUS_CANCELED;

      update(index);
    };

    $scope.progress = function(index){
      $scope.data.orders[index].status = STATUS_IN_PROGRESS;
      update(index);
    };

    $scope.archive = function(index){
      $scope.data.orders[index].status = STATUS_ARCHIVED;
      update(index);
    };

    $scope.shipped = function(index){
      $scope.data.orders[index].status = STATUS_SHIPPED;
      update(index);
    };

    // unregister the listener to avoid memory leak
    $scope.$on('$destroy', function() {
      $interval.cancel(updateTime);
      listUpdatedListener()
    });

    $(window).trigger('resize');

    $scope.changeLanguage = function(key) {
      $translate.use(key);
    };
  }]);

angular.module('newsApp')
  .controller('RestaurantOrdersDetailsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$log',
    'RestaurantOrders',
    function($scope, $rootScope, $state, $stateParams, $log, RestaurantOrders) {
      // hold the details
      $scope.order = {};

      // hold ui related info
      $scope.ui = {};

      var ref;
      switch ($stateParams.ref) {
        case 'print':
          ref= 'back';
          break;
        case 'back':
          ref= 'back';
          break;
        default:
          ref='';
      }
      $scope.ui.ref = ref;

      function print(){
        $(document).ready(function(){
          setTimeout(function(){
            window.print();
            $state.go('restaurant_orders');
          },500);
        });
      }

      function update(){
        RestaurantOrders.update($scope.order._id, $scope.order).then(function onSuccess(response) {
          console.log('response: %o', response);

          var body = response.data;
          $scope.order = body.result;

          $.notify('The order status has been updated.', {'status':'info'} || {});
          $scope.sendChangedStatusEmail($scope.order);

        }, function onError(response) {
          $log.error('response', response);
        });
      }

      $scope.sendChangedStatusEmail = function (order) {
        RestaurantOrders.orderChangeStatusNotify(order.shipping.email, order.friendlyID, map[order.status])
      }


      // fetch single data
      RestaurantOrders.findOne($stateParams.id).then(function(response) {
        var body = response.data;

        // Calculate taxes and sub total
        var items = body.result.items;
        var tax = {};

        // v = n * (1 + r)
        //
        // n = v / (1 + r)
        //
        // t = v - n
        // t = v - (v / (1 + r))
        // t = v * (1 - (1/(1 + r )))

        var taxTotal = 0;
        var grandTotal = 0;
        for (var i in items){
          var t = items[i].tax;
          var unitPrice = items[i].unitPrice;
          var q = items[i].quantity;
          var v = unitPrice * (1 - 1 / (1 + items[i].tax.percentage));
          if (tax[t.percentage]){
            tax[t.percentage] = tax[t.percentage] + v * q;
          }else{
            tax[t.percentage] = v * q;
          }

          taxTotal = taxTotal + v;
          grandTotal = grandTotal + unitPrice * q;
        }

        var taxarr = [];
        for(var x in tax){
          taxarr.push({percentage: x, value: tax[x]});
        }

        $scope.order = body.result;
        $scope.order.tax = taxarr;
        $scope.order.taxTotal = taxTotal;
        $scope.order.netTotal = grandTotal - taxTotal;

        // TODO: The grandTotal is saved correctly in the backend so we should not override it with client side calculations.
        // $scope.order.grandTotal = grandTotal;

        // The first time an order is opened we
        // should change its status from unread to new
        if ($scope.order.status === STATUS_NEW_UNREAD){
          $scope.order.status = STATUS_NEW;

          update();
        }

        if ($stateParams.ref === 'print'){
          print();
        }

      });

      $scope.open = function(){
        console.log('Mark order as open: %o', $scope.order);
        $scope.order.status = STATUS_NEW;

        update();
      };

      $scope.shipped = function(){
        console.log('Mark order as shipped: %o', $scope.order);
        $scope.order.status = STATUS_SHIPPED;

        update();
      };

      $scope.complete = function(){
        console.log('Mark order as completed: %o', $scope.order);
        $scope.order.status = STATUS_DELIVERED;

        update();
      };

      $scope.cancel = function(){
        console.log('Mark order as canceled: %o', $scope.order);
        $scope.order.status = STATUS_CANCELED;

        update();
      };

      $scope.progress = function() {
        console.log('Mark order as canceled: %o', $scope.order);
        $scope.order.status = STATUS_IN_PROGRESS;
        update();
      };

      $scope.archive = function() {
        console.log('Mark order as canceled: %o', $scope.order);
        $scope.order.status = STATUS_ARCHIVED;

        update();
      };

    }
  ]);
