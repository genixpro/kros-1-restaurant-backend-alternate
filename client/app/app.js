'use strict';

angular.module('newsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',

    'ui.router',
    'ui.bootstrap',
    'ui.bootstrap.dropdown',
    'angularFileUpload',
    'ui.sortable',
    'pascalprecht.translate',
    'youtube-embed',
    'ui.calendar',
    'ui.select',
    'ngDragDrop',
    'ui.mask',
    'ui.bootstrap.datetimepicker',
    'ngCsv',
    'angular.filter',
    'angular-timezone-selector',
    'ngStorage',
    'angularMoment',
    'ngAudio',

    'config'
  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      // CONFIG: Set the default landing URL
      .otherwise('/');
      // .otherwise('/submissioncode');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  .config(function(toastrProvider) {
    toastrProvider.setDefaultOptions({
      pos: 'top-right'
    });
  })
  // configure the angular-translate
  .config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: '/assets/languages/',
      suffix: '.json'
    });
    // Set default language en | el
    $translateProvider.preferredLanguage('en');
  })
  .config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  })

  .factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function(config) {
        config.headers = config.headers || {};
        if($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          // CONFIG: Set the default landing URL for anonymous
          $location.path('/login');
          // $location.path('/submissioncode');
          // $location.path('/welcome');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  })

  .filter('percentage', ['$filter', function($filter) {
    return function(input, decimals) {
      return $filter('number')(input * 100, decimals) + '%';
    };
  }])

  .run(function($rootScope, $location, Auth, $localStorage, $http) {
    $localStorage.$default({
      // timezone: 'America/New_York'
      timezone: 'America/Los_Angeles'
    });

    $rootScope.$on('auth:login', function() {
      delete $localStorage.selectedApplication;
      $http.defaults.headers.common['app_id'] = undefined;
    });

    $http.defaults.headers.common['app_id'] = $localStorage.selectedApplication;
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          // CONFIG: Set the defaul landing URL after failed auth
          $location.path('/login');
            // $location.path('/submissioncode');
          // $location.path('/welcome');
        } else {
          Auth.getCurrentUser().selectedApplication = $localStorage.selectedApplication;
          $rootScope.$emit('app:selected');
        }
      });

      // listen for app selection
      $rootScope.$on('app:selected', function() {
        // pass selected app via the headers
        var currentUser = Auth.getCurrentUser();
        $localStorage.selectedApplication = currentUser.selectedApplication;
        $http.defaults.headers.common['app_id'] = currentUser.selectedApplication;
      });
    });
  });
