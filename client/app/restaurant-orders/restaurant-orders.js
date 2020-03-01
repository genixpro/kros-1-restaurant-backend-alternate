'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/restaurant-orders/:status',
        views: {
          '': {
            templateUrl: 'app/restaurant-orders/restaurant-orders.html'
          },
          'mainPane@restaurant_orders': {
            templateUrl: 'app/restaurant-orders/view-list.html',
            controller: 'RestaurantOrdersListCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id?ref',
        views: {
          'mainPane@restaurant_orders': {
            templateUrl: 'app/restaurant-orders/view-details.html',
            controller: 'RestaurantOrdersDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('restaurant_orders', states.list)
      .state('restaurant_orders.details', states.details);
  });
