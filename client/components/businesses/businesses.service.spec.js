'use strict';

describe('Service: businesses', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Businesses;
  beforeEach(inject(function (_Businesses_) {
    Businesses = _Businesses_;
  }));

  it('should be exist', function () {
    expect(!!Accounts).toBe(true);
  });

  it('create() should NOT be defined', function() {
    expect(Businesses.create).not.toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Businesses.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Businesses.findOne).toBeDefined();
  });

  it('delete() should NOT be defined', function() {
    expect(Businesses.delete).not.toBeDefined();
  });

});
