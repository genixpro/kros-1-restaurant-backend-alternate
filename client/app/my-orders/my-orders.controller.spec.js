'use strict';
describe('my-orders.controller', function() {
  describe('Controller: MyOrdersListCtrl', function () {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl, scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('MyOrdersListCtrl', {
        $scope: scope
      });
    }));

    it('should have a offers model', function() {
      expect(scope.data.orders).toBeDefined();
    });
  });
  
  
  
  describe('Controller: MyOrdersDetailsCtrl', function() {
    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('MyOrdersDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data.model).toBeDefined();
    });
  });
});
