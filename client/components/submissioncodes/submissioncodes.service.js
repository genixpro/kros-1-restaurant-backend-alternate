'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('SubmissionCodes', function(API, $http) {

    var API_ENDPOINT = API.url + API.endpoint.submission_codes;
  console.log('API_ENDPOINT: '+API_ENDPOINT);
    // Public API here
    return {
      get: function(key, email) {

        return $http.get(API_ENDPOINT + 'sendemail', {
          params: {
            key: key,
            email: email
          }
        });
      },
      conference: function(key){
        return $http.get(API_ENDPOINT + 'conference', {
          params: {
            key: key
          }
        });
      }
    };
  });
