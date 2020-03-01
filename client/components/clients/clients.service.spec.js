'use strict';

describe('Service: Clients', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Clients;
  beforeEach(inject(function(_Clients_) {
    Clients = _Clients_;
  }));

  it('should be exist', function() {
    expect(!!Clients).toBe(true);
  });
});
