'use strict';

describe('platform-orders.controller', function() {
  describe('Controller: PlatformOrdersListCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PlatformOrdersListCtrl', {
        $scope: scope
      });
    }));

    it('should have a platform orders model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });


  describe('Controller: PlatformOrdersAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PlatformOrdersAddFormCtrl', {
        $scope: scope
      });
    }));

    it('should have a platform orders model', function() {
      expect(scope.data).toBeDefined();
      expect(scope.data.model).toBeDefined();
      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();
      expect(scope.save).toBeDefined();

    });
  });

  describe('Controller: PlatformOrdersUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PlatformOrdersUpdateFormCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {


      expect(scope.data).toBeDefined();

      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();

      expect(scope.update).toBeDefined();

    });
  });

  describe('Controller: PlatformOrdersDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PlatformOrdersDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: PlatformOrdersItemCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('PlatformOrdersItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deletePlatformOrder).toBeDefined();
    });
  });

});
