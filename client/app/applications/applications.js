'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {
    var states = {
      list: {
        url: '/applications',
        views: {
          '': {
            templateUrl: 'app/applications/applications.html'
          },
          'leftPane@applications': {
            templateUrl: 'app/applications/view-list.html',
            controller: 'ApplicationsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@applications': {
            templateUrl: 'app/applications/form-add.html',
            controller: 'ApplicationsAddFormCtrl'
          }
        },
        authenticate: true
      },
      edit: {
        url: '/:id/edit',
        views: {
          'rightPane@applications': {
            templateUrl: 'app/applications/form-edit.html',
            controller: 'ApplicationsEditFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@applications': {
            templateUrl: 'app/applications/view-details.html',
            controller: 'ApplicationsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('applications', states.list)
      .state('applications.add', states.add)
      .state('applications.edit', states.edit)
      .state('applications.details', states.details);
  });
