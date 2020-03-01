'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('business', {
        url: '/business',
        templateUrl: 'app/accounts/business.html',
        controller: 'AccountsBusinessCtrl'
      })
      .state('photos', {
        url: '/photos',
        templateUrl: 'app/accounts/photos.html',
        controller: 'AccountsPhotoCtrl'
      })
      .state('invoice', {
        url: '/invoice',
        templateUrl: 'app/accounts/invoice.html',
        controller: 'AccountsInvoiceCtrl'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/accounts/contact.html',
        controller: 'AccountsContactCtrl'
      });
  });
