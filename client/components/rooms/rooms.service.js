'use strict';

angular.module('newsApp')
  .factory('Rooms', function (API, $resource) {

      return $resource( API.url + API.endpoint.rooms + ':id', {id:'@_id'},
      {
        query: {
          method : 'GET',
          page : 'page',
          category: 'category',
          search: 'search',
          total_number: 'total_number',
          summary: 'summary',
          state: 'state'
        }
        , unique: {
          method: 'GET',
          field: 'field',
          count: 'count'
        }
      });
      
  });
