'use strict';

describe('downloads.controller', function() {
  describe('Controller: DownloadsListCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('DownloadsListCtrl', {
        $scope: scope
      });
    }));

    it('should have a downloads model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });


  describe('Controller: DownloadsAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('DownloadsAddFormCtrl', {
        $scope: scope
      });
    }));

    it('should have a downloads model', function() {
      expect(scope.data).toBeDefined();
      expect(scope.data.model).toBeDefined();
      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();
      expect(scope.save).toBeDefined();

    });
  });

  describe('Controller: DownloadsUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('DownloadsUpdateFormCtrl', {
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

  describe('Controller: DownloadsDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('DownloadsDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: DownloadsItemCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('DownloadsItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deleteDownload).toBeDefined();
    });
  });

});
