'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('Clients', ['API', '$resource',
    function(API, $resource) {
      var API_ENDPOINT = API.url + API.endpoint.clients;

      return $resource(API_ENDPOINT + ':id', {
        id: '@_id'
      }, {
        generateKeys: {
          method: 'POST',
          params: {
            id: 'keys'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      });
    }
  ]);
