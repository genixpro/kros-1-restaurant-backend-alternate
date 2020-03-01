'use strict';

describe('Controller: BusinessesCtrl', function () {

  // load the controller's module
  beforeEach(module('newsApp'));

  var AccountsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BusinessesCtrl = $controller('BusinessesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
