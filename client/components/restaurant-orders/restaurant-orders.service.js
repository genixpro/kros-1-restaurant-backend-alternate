'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('RestaurantOrders', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.restaurantOrders;

      // Public APIs
      return {
        create: function(data) {
          return $http.post(API_ENDPOINT, data);
        },
        get: function(page) {
          return $http.get(API_ENDPOINT, {
            params: {
              page: page
            }
          });
        },
        getByStatus: function(page, status) {
          return $http.get(API_ENDPOINT, {
            params: {
              page: page,
              status: status
            }
          });
        },
        update: function(id, data) {
          return $http.put(API_ENDPOINT + id, data);
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        delete: function(id) {
          return $http.delete(API_ENDPOINT + id);
        },
        getSummary: function() {
          return $http.get(API_ENDPOINT + 'summary');
        },
        getInterval: function() {
          return $http.get(API_ENDPOINT + 'interval');
        },
        orderChangeStatusNotify: function(email, friendlyID, status) {
          return $http.get(API_ENDPOINT + 'orderChangeStatusNotify', {
            params: {
              email: email,
              friendlyID: friendlyID,
              status: status
            }
          });
        },
        orderCreatedNotify: function(email, friendlyID) {
          return $http.get(API_ENDPOINT + 'orderCreatedNotify', {
            params: {
              email: email,
              friendlyID: friendlyID
            }
          });
        }
      };
    }
  ]);
  
