'use strict';

describe('Service: PlatformOrders', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var PlatformOrders;
  beforeEach(inject(function(_PlatformOrders_) {
    PlatformOrders = _PlatformOrders_;
  }));

  it('should be exist', function() {
    expect(!!PlatformOrders).toBe(true);
  });

  it('save() should be defined', function() {
    expect(PlatformOrders.save).toBeDefined();
  });

  it('query() should be defined', function() {
    expect(PlatformOrders.query).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(PlatformOrders.get).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(PlatformOrders.delete).toBeDefined();
  });

  it('update() should be defined', function() {
    expect(PlatformOrders.update).toBeDefined();
  });
});
