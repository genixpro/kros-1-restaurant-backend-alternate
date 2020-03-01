'use strict';

/**
 * Factory service to handle API request
 */

angular.module('newsApp')
  .factory('S3Downloads', ['API', '$resource',
    function (API, $resource) {
      var API_ENDPOINT = API.url + API.endpoint.s3downloads;

      return $resource(
        API_ENDPOINT + ':id', {
          id: "@_id"
        }, {
          create: {
            method: 'POST',// this method issues a POST request
            transformResponse: function (data, headers) {
              return JSON.parse(data).result;
            }
          },
          update: {
            method: 'PUT',// this method issues a PUT request
            transformResponse: function (data, headers) {
              return JSON.parse(data).result;
            }
          },
          delete: {
            method: 'DELETE',// this method issues a DELETE request
            transformResponse: function (data) {
              return JSON.parse(data).result;
            }
          },
          query: {
            method: 'get',
            isObject: true,
            transformResponse: function (data) {
              return JSON.parse(data);
            }
          },
          getAll: {
            method: 'get',
            isArray: true,
            transformResponse: function (data) {
              return JSON.parse(data).result;
            }
          },
          get: {
            method: 'get',
            transformResponse: function (data) {
              return JSON.parse(data).result;
            }
          }


        });

    }
  ]);
