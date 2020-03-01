'use strict';
/**
 * @class angular_module.newsApp.config
 * @memberOf angular_module.newsApp
 *
 * @description This is an angularjs config.
 * sets the configuration application when we turn on the url '/'
 *
 */
angular.module('newsApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true
      });


  });
