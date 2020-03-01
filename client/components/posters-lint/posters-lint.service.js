'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('PostersLint', ['API', '$resource',
    function(API, $resource) {

      return $resource( API.url + API.endpoint.postersLint + ':object/:type', {},
        {
          empty_sessions:{
            method:'GET',
            params:{
              object:'sessions',
              type:'empty'
            }
          },
          overflown_sessions:{
            method:'GET',
            params:{
              object:'sessions',
              type:'overflown'
            }
          },
          non_assigned_posers:{
            method:'GET',
            params:{
              object:'posters',
              type:'non-assigned'
            }
          },
          summaryData:{
            method:'GET',
            params:{
//              object:'posters-lint',
              type:'summary'
            }
          }
        });

    }]);
