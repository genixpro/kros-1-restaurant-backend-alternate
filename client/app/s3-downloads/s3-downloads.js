'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {

    var states = {
      list: {
        url: '/s3downloads/list',
        views: {
          '': {
            templateUrl: 'app/s3-downloads/s3-downloads.html'
          },
          'leftPane@s3downloads': {
            templateUrl: 'app/s3-downloads/view-list.html',
            controller: 'S3DownloadsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        url:'/add',
        views: {
          'rightPane@s3downloads': {
            templateUrl: 'app/s3-downloads/form.html',
            controller: 'S3DownloadsFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@s3downloads': {
            templateUrl: 'app/s3-downloads/form.html',
            controller: 'S3DownloadsFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@s3downloads': {
            templateUrl: 'app/s3-downloads/form.html',
            controller: 'S3DownloadsFormCtrl'
          }
        },
        authenticate: true
      }
    };
//
    $stateProvider
      .state('s3downloads', states.list)
      .state('s3downloads.add', states.add)
      .state('s3downloads.update', states.update)
      .state('s3downloads.details', states.details);
  });
