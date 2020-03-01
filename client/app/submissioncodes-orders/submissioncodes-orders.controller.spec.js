'use strict';

describe('submissioncodes-orders.controller', function() {
  describe('Controller: SubmissioncodesOrdersListCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('SubmissioncodesOrdersListCtrl', {
        $scope: scope
      });
    }));

    it('should have a submissioncodes orders model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });


  describe('Controller: SubmissioncodesOrdersAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('SubmissioncodesOrdersAddFormCtrl', {
        $scope: scope
      });
    }));

    it('should have a submissioncodes orders model', function() {
      expect(scope.data).toBeDefined();
      expect(scope.data.model).toBeDefined();
      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();
      expect(scope.save).toBeDefined();

    });
  });

  describe('Controller: SubmissioncodesOrdersUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('SubmissioncodesOrdersUpdateFormCtrl', {
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

  describe('Controller: SubmissioncodesOrdersDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('SubmissioncodesOrdersDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: SubmissioncodesOrdersItemCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('SubmissioncodesOrdersItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deleteSubmissioncodesOrder).toBeDefined();
    });
  });

});
