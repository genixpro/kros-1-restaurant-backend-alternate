'use strict';

describe('Service: CatalogueCategories', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Categories;
  beforeEach(inject(function(_Categories_) {
    Categories = _Categories_;
  }));

  it('should be exist', function() {
    expect(!!Categories).toBe(true);
  });

  it('save() should be defined', function() {
    expect(Categories.save).toBeDefined();
  });

  it('query() should be defined', function() {
    expect(Categories.query).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Categories.get).toBeDefined();
  });

  it('remove() should be defined', function() {
    expect(Categories.remove).toBeDefined();
  });
});
