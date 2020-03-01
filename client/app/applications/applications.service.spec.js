'use strict';

describe('Service: Applications', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var applications;
  beforeEach(inject(function (_Applications_) {
    applications = _Applications_;
  }));

  it('should do something', function () {
    expect(!!applications).toBe(true);
  });

});
