'use strict';

describe('Service: Restaurant Orders', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var RestaurantOrders;
  beforeEach(inject(function (_RestaurantOrders_) {
    RestaurantOrders = _RestaurantOrders_;
  }));

  it('should do something', function () {
    expect(!!RestaurantOrders).toBe(true);
  });

});
