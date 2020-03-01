'use strict';

/**
 * Factory service to handle API request
 */

angular.module('newsApp')
  .factory('Downloads', ['API', '$resource',
    function(API, $resource) {
      var API_ENDPOINT = API.url + API.endpoint.downloads;

      var downloads = $resource(
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
          }
        })
      
      return downloads;
    }
  ]);
