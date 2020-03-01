'use strict';

/**
 * Factory service to handle API request
 */

angular.module('newsApp')
  .factory('SubmissioncodesOrders', ['API', '$resource',
    function(API, $resource) {
      var API_ENDPOINT = API.url + API.endpoint.submissioncodesOrders;

      var submissioncodesOrders = $resource(
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
            // isArray: true,
            // transformResponse: function(data) {
            //   return JSON.parse(data);
            // },
            page: 'page',
            limit: 'limit',
            search : 'search'
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
        });

      return submissioncodesOrders;
    }
  ]);
