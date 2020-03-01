'use strict';

describe('Service: Products', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Products;
  beforeEach(inject(function(_Products_) {
    Products = _Products_;
  }));

  it('should be exist', function() {
    expect(!!Products).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Products.create).toBeDefined();
  });

  it('update() should be defined', function() {
    expect(Products.update).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Products.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Products.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Products.delete).toBeDefined();
  });

});
