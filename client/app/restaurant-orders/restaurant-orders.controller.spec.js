'use strict';

describe('Controller: RestaurantOrdersListCtrl', function () {

  // load the controller's module
  beforeEach(module('newsApp'));

  var Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    httpBackend = $httpBackend;
    Ctrl = $controller('RestaurantOrdersListCtrl', {
      $scope: scope
    });
  }));

  it('should have a offers model', function() {
    expect(scope.data.orders).toBeDefined();
  });
  
  it('should send request orderCreatedNotify', function() {
     httpBackend.expectGET('/api/restaurant-orders/orderCreatedNotify');
     httpBackend.flush();
  });

});
