'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {

    var states = {
      list: {
        url: '/my-downloads',
        views: {
          '': {
            templateUrl: 'app/my-downloads/my-downloads.html'
          },
          'mainPane@my_downloads': {
            templateUrl: 'app/my-downloads/view-list.html',
            controller: 'MyDownloadsListCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'mainPane@my_downloads': {},
          'leftPane@my_downloads': {
            templateUrl: 'app/my-downloads/view-list.html',
            controller: 'MyDownloadsListCtrl'
          },
          'rightPane@my_downloads': {
            templateUrl: 'app/my-downloads/view-details.html',
            controller: 'MyDownloadsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('my_downloads', states.list)
      .state('my_downloads.details', states.details);
  });
