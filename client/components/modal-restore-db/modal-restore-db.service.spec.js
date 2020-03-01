'use strict';

describe('Service: modalRestoreDB', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var modalRestoreDB;
  beforeEach(inject(function (_modalRestoreDB_) {
    modalRestoreDB = _modalRestoreDB_;
  }));

  it('should do something', function () {
    expect(!!modalRestoreDB).toBe(true);
  });

});
