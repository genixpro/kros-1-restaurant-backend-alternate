'use strict';

console.log('www')
angular.module('newsApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('businesses_info', {
        url: '/businesses-info',
        templateUrl: 'app/businesses/info.html',
        controller: 'BusinessesBusinessCtrl'
      })
      .state('businesses_photos', {
        url: '/businesses-photos',
        templateUrl: 'app/businesses/photos.html',
        controller: 'BusinessesPhotoCtrl'
      })
      .state('businesses_invoice', {
        url: '/businesses-invoice',
        templateUrl: 'app/businesses/invoice.html',
        controller: 'BusinessesInvoiceCtrl'
      })
      .state('businesses_contact', {
        url: '/businesses-contact',
        templateUrl: 'app/accounts/contact.html',
        controller: 'BusinessesContactCtrl'
      });
  });
