'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('Posters', ['API', '$resource',
    function(API, $resource) {

      return $resource( API.url + API.endpoint.posters + ':id/:object/:action', {id:'@_id'},
      {
        query: {
          method : 'GET',
          page : 'page',
          room_id : 'room_id',
          presentationType : 'presentationType',
          assigned : 'assigned',
          search : 'search',
          date_start: 'date_start' ,
          date_end: 'date_end',
          total_number: 'total_number',
          room: 'room',
          summary: 'summary',
          canceled: 'canceled',
          no_empty: 'no_empty'
        }
        , unique: {
          method: 'GET',
          field: 'field',
          count: 'count'
        }
        , update: {
          method: 'PUT'
        }
        , removeAll: {
          method: 'DELETE'
        }
        , clearAssignments:{
          method: 'POST',
          params:{
            object: 'batch-actions',
            action: 'clear-assigments'
          }
        },
        presentationTypes:{
          metod:'GET',
          params:{
            object: 'summary',
            action: 'presentation-types'
          }

        }
      });

  }]);
