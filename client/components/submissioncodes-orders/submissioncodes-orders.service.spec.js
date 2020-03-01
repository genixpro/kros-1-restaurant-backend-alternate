'use strict';

describe('Service: SubmissioncodesOrders', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var SubmissioncodesOrders;
  beforeEach(inject(function(_SubmissioncodesOrders_) {
    SubmissioncodesOrders = _SubmissioncodesOrders_;
  }));

  it('should be exist', function() {
    expect(!!SubmissioncodesOrders).toBe(true);
  });

  it('save() should be defined', function() {
    expect(SubmissioncodesOrders.save).toBeDefined();
  });

  it('query() should be defined', function() {
    expect(SubmissioncodesOrders.query).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(SubmissioncodesOrders.get).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(SubmissioncodesOrders.delete).toBeDefined();
  });

  it('update() should be defined', function() {
    expect(SubmissioncodesOrders.update).toBeDefined();
  });
});
