'use strict';

/**
 * Factory service to handle API request
 */

angular.module('newsApp')
  .factory('PlatformOrders', ['API', '$resource',
    function(API, $resource) {
      var API_ENDPOINT = API.url + API.endpoint.platformOrders;

      var platformOrders = $resource(
        API_ENDPOINT + ':id', {
          id: "@_id"
        }, {
          update: {
            method: 'PUT',// this method issues a PUT request
            transformResponse: function(data, headers) {
              return JSON.parse(data).result; 
            }
          },
          query: {
            method: 'get', 
            isArray: true, 
            transformResponse: function(data) {
              return JSON.parse(data).result; 
            }
          },
          get: {
            method: 'get', 
            transformResponse: function(data) {
              return JSON.parse(data).result; 
            }
          },
          getByEmail: {
            method: 'get', 
            url: API_ENDPOINT,
            params: {email: true, page: '@page'}
          }
        })
      
      return platformOrders;
    }
  ]);
