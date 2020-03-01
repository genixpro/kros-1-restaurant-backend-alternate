angular.module('newsApp')
  .factory('PostersExport', ['API', '$resource',
    function(API, $resource) {

      return $resource(API.url + API.endpoint.export+':object', {id:'@_id'},
        {
          query: {
            method: 'GET'
          },
          getPosters: {
            method: 'GET',
            delimiter:'delimiter',
            params:{
              object: 'posters'
            }
          },
          getSchedule: {
            method: 'GET',
            presentationType: 'presentationType',
            search: 'search',
            date_start: 'date_start',
            date_end: 'date_end',
            room: 'room',
            delimiter:'delimiter',
            params:{
              object: 'schedule'
            }
          },
          remove:{
            method: 'delete',
            delUrl: 'delUrl'

          }
        })
    }
  ]);
