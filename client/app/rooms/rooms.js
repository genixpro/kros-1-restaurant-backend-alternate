'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {
      var _preLoadCategories = preLoadCategories;
      var _preLoadRooms = preLoadRooms;

    var states = {
      list: {
        url: '/rooms',
        views: {
          '': {
            templateUrl: 'app/rooms/rooms.html'
          },
          'leftPane@rooms': {
            templateUrl: 'app/rooms/view-list.html',
            controller: 'RoomsListCtrl',
            resolve: {
              preLoadCategories: _preLoadCategories,
              preLoadRooms: _preLoadRooms
            }
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@rooms': {
            templateUrl: 'app/rooms/form.html',
            controller: 'RoomsFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@rooms': {
            templateUrl: 'app/rooms/form.html',
            controller: 'RoomsFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@rooms': {
            templateUrl: 'app/rooms/view-details.html',
            controller: 'RoomsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

      preLoadCategories.$inject = ['Rooms'];
      function preLoadCategories(Rooms){
        return Rooms.unique({field: 'category'}).$promise.then(function(response) {
          return response
        })
      }

      preLoadRooms.$inject = ['Rooms'];
      function preLoadRooms(Rooms){
        return Rooms.query({page: 1}).$promise.then(function(response) {
          return response
        })
      }

    $stateProvider
      .state('rooms', states.list)
      .state('rooms.add', states.add)
      .state('rooms.update', states.update)
      .state('rooms.details', states.details);
  });
