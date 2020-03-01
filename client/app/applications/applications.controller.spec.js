'use strict';

describe('Controller: ApplicationsCtrl', function () {

  // load the controller's module
  beforeEach(module('newsApp'));

  var ApplicationsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplicationsCtrl = $controller('ApplicationsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
