'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('DB', ['API', '$resource',
    function(API, $resource) {

      return $resource( API.url + API.endpoint.db + ':id', {id:'@_id'},
      {
        query: {
          method : 'GET'
        }
        , restore: {
          method: 'PUT'
        }
      });

  }]);
