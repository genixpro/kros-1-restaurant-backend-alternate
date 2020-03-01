'use strict';

describe('Service: reports', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Reports;
  beforeEach(inject(function (_Reports_) {
    Reports = _Reports_;
  }));

  it('should be exist', function () {
    expect(!!Reports).toBe(true);
  });

  it('get() should be defined', function() {
    expect(Reports.get).toBeDefined();
  });

  it('all() should be defined', function() {
    expect(Reports.all).toBeDefined();
  });

  it('records() should be defined', function() {
    expect(Reports.records).toBeDefined();
  });

  it('url() should be defined', function() {
    expect(Reports.url).toBeDefined();
  });

});
