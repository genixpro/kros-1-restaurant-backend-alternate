'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {
    var states = {
      list: {
        url: '/downloads',
        views: {
          '': {
            templateUrl: 'app/downloads/downloads.html'
          },
          'leftPane@downloads': {
            templateUrl: 'app/downloads/view-list.html',
            controller: 'DownloadsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@downloads': {
            templateUrl: 'app/downloads/form-add.html',
            controller: 'DownloadsAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@downloads': {
            templateUrl: 'app/downloads/form-update.html',
            controller: 'DownloadsUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@downloads': {
            templateUrl: 'app/downloads/view-details.html',
            controller: 'DownloadsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('downloads', states.list)
      .state('downloads.add', states.add)
      .state('downloads.update', states.update)
      .state('downloads.details', states.details);
  });
