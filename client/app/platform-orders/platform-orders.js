'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {
    var states = {
      list: {
        url: '/platform-orders',
        views: {
          '': {
            templateUrl: 'app/platform-orders/platform-orders.html'
          },
          'leftPane@platform_orders': {
            templateUrl: 'app/platform-orders/view-list.html',
            controller: 'PlatformOrdersListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@platform_orders': {
            templateUrl: 'app/platform-orders/form-add.html',
            controller: 'PlatformOrdersAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@platform_orders': {
            templateUrl: 'app/platform-orders/form-update.html',
            controller: 'PlatformOrdersUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@platform_orders': {
            templateUrl: 'app/platform-orders/view-details.html',
            controller: 'PlatformOrdersDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('platform_orders', states.list)
      .state('platform_orders.add', states.add)
      .state('platform_orders.update', states.update)
      .state('platform_orders.details', states.details);
  });
