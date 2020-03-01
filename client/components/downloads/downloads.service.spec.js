'use strict';

describe('Service: Downloads', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Downloads;
  beforeEach(inject(function(_Downloads_) {
    Downloads = _Downloads_;
  }));

  it('should be exist', function() {
    expect(!!Downloads).toBe(true);
  });

  it('save() should be defined', function() {
    expect(Downloads.save).toBeDefined();
  });

  it('query() should be defined', function() {
    expect(Downloads.query).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Downloads.get).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Downloads.delete).toBeDefined();
  });

  it('update() should be defined', function() {
    expect(Downloads.update).toBeDefined();
  });
});
