'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/my-orders',
        views: {
          '': {
            templateUrl: 'app/my-orders/my-orders.html'
          },
          'mainPane@my_orders': {
            templateUrl: 'app/my-orders/view-list.html',
            controller: 'MyOrdersListCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id?ref',
        views: {
          'mainPane@my_orders': {
            templateUrl: 'app/my-orders/view-details.html',
            controller: 'MyOrdersDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('my_orders', states.list)
      .state('my_orders.details', states.details);
  });
