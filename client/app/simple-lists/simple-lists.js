'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var prefix = 'simple-lists';

    var states = {
      list: {
        url: '/' + prefix,
        views: {
          '': {
            templateUrl: 'app/' + prefix + '/shell.html'
          },
          'leftPane@simpleLists': {
            templateUrl: 'app/' + prefix + '/view-list.html',
            controller: 'SimpleListsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@simpleLists': {
            templateUrl: 'app/' + prefix + '/form-add.html',
            controller: 'SimpleListsAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@simpleLists': {
            templateUrl: 'app/' + prefix + '/form-update.html',
            controller: 'SimpleListsUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@simpleLists': {
            templateUrl: 'app/' + prefix + '/view-details.html',
            controller: 'SimpleListsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('simpleLists', states.list)
      .state('simpleLists.add', states.add)
      .state('simpleLists.update', states.update)
      .state('simpleLists.details', states.details);
  });
