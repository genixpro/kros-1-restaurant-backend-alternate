'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/catalogue-categories',
        views: {
          '': {
            templateUrl: 'app/catalogue-categories/catalogue-categories.html'
          },
          'leftPane@catalogueCategories': {
            templateUrl: 'app/catalogue-categories/view-list.html',
            controller: 'CatalogueCategoriesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@catalogueCategories': {
            templateUrl: 'app/catalogue-categories/form-add.html',
            controller: 'CatalogueCategoriesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@catalogueCategories': {
            templateUrl: 'app/catalogue-categories/form-update.html',
            controller: 'CatalogueCategoriesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@catalogueCategories': {
            templateUrl: 'app/catalogue-categories/view-details.html',
            controller: 'CatalogueCategoriesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('catalogueCategories', states.list)
      .state('catalogueCategories.add', states.add)
      .state('catalogueCategories.update', states.update)
      .state('catalogueCategories.details', states.details);
  });
