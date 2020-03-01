'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {
    var states = {
      list: {
        url: '/submissioncodes-orders',
        views: {
          '': {
            templateUrl: 'app/submissioncodes-orders/submissioncodes-orders.html'
          },
          'leftPane@submissioncodes_orders': {
            templateUrl: 'app/submissioncodes-orders/view-list.html',
            controller: 'SubmissioncodesOrdersListCtrl',
            controllerAs: 'listCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@submissioncodes_orders': {
            templateUrl: 'app/submissioncodes-orders/form-add.html',
            controller: 'SubmissioncodesOrdersAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@submissioncodes_orders': {
            templateUrl: 'app/submissioncodes-orders/form-update.html',
            controller: 'SubmissioncodesOrdersUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@submissioncodes_orders': {
            templateUrl: 'app/submissioncodes-orders/view-details.html',
            controller: 'SubmissioncodesOrdersDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('submissioncodes_orders', states.list)
      .state('submissioncodes_orders.add', states.add)
      .state('submissioncodes_orders.update', states.update)
      .state('submissioncodes_orders.details', states.details);
  });
