'use strict';

ddescribe('Service: Submission Codes', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var SubmissionCodes;
  beforeEach(inject(function(_SubmissionCodes_) {
    SubmissionCodes = _SubmissionCodes_;
  }));

  it('should be exist', function() {
    expect(!!SubmissionCodes).toBe(true);
  });

  it('get() should be defined', function() {
    expect(SubmissionCodes.get).toBeDefined();
  });


});
