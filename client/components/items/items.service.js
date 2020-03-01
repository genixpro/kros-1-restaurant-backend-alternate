'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .service('Items', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.items;

      // Public API here
      return {
        create: function(data) {
          return $http.post(API_ENDPOINT, data);
        },
        update: function(id, data) {
          return $http.put(API_ENDPOINT + id, data);
        },
        get: function() {
          return $http.get(API_ENDPOINT);
        },
        getByCategory: function(catId) {
          return $http.get(API_ENDPOINT + 'category/' + catId);
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        delete: function(id) {
          return $http.delete(API_ENDPOINT + id);
        }
      };
    }
  ]);
