'use strict';

angular.module('newsApp')
  .controller('ApplicationsListCtrl', function($scope, ApplicationsManager) {
    $scope.applications = ApplicationsManager.applications;
    $scope.types = ApplicationsManager.types;
  })
  .controller('ApplicationsItemCtrl', function($scope, modalDeleteItem, Applications, ApplicationsManager) {
    $scope.typeName = ApplicationsManager.typeName;

    $scope.delete = function(application) {
      modalDeleteItem.open(function() {
        var index = $scope.applications.indexOf(application);
        Applications.delete({id: application._id});
        $scope.applications.splice(index, 1);
      });
    };
  })
  .controller('ApplicationsAddFormCtrl', function($scope, $state, $stateParams, Applications, ApplicationsManager) {
    $scope.application = {};
    // $scope.owners = ApplicationsManager.owners($scope.application.owners);
    var _owners = ApplicationsManager.owners($scope.application.owners);
    console.log('ApplicationsAddFormCtrl: Owners: ', _owners);
    $scope.owners = _owners;
    $scope.types = ApplicationsManager.types;
    $scope.checkOwner = ApplicationsManager.checkOwner;

    // watch for changes in owners
    $scope.$watch('owners', function() {
      $scope.invalidOwners = _.any($scope.owners, 'error');
    }, true);

    $scope.addOwner = function() {
      $scope.owners.push({email: ''});
    };

    $scope.deleteOwner = function(owner) {
      var index = _.indexOf($scope.owners, owner);
      $scope.owners.splice(index, 1);
    };

    $scope.save = function() {
      $scope.application.owners = _.uniq(_.compact(_.map($scope.owners, 'id')));

      console.log("Saving Application: ", $scope.application);
      Applications.save($scope.application, function(app) { // response is the new saved app object
        console.log("Saved Application: ", app);
        ApplicationsManager.applications.push(app);
        $state.transitionTo('applications.details', {id: app._id});
      });
    };
  })
  .controller('ApplicationsEditFormCtrl', function($scope, $state, $stateParams, $log, Applications, ApplicationsManager) {
    ApplicationsManager.applications.$promise.then(function(apps) {
      $scope.application = angular.copy(_.find(apps, {_id: $stateParams.id}));
      $scope.owners = ApplicationsManager.owners($scope.application.owners);
    });

    $scope.typeName = ApplicationsManager.typeName;
    $scope.checkOwner = ApplicationsManager.checkOwner;

    // watch for changes in owners
    $scope.$watch('owners', function() {
      $scope.invalidOwners = _.any($scope.owners, 'error');
    }, true);

    $scope.addOwner = function() {
      $scope.owners.push({email: ''});
    };

    $scope.deleteOwner = function(owner) {
      var index = _.indexOf($scope.owners, owner);
      $scope.owners.splice(index, 1);
    };

    $scope.save = function() {
      var appId = $scope.application._id;
      $scope.application.owners = _.uniq(_.compact(_.map($scope.owners, 'id')));
      Applications.update({id: appId}, $scope.application, function() {
        // update shared db apps
        var index = _.findIndex(ApplicationsManager.applications, {_id: appId});
        ApplicationsManager.applications[index] = $scope.application;
        $state.transitionTo('applications.details', {id: appId});
      });
    };
  })
  .controller('ApplicationsDetailsCtrl', function($scope, $stateParams, $log, User, Auth, ApplicationsManager) {
    ApplicationsManager.applications.$promise.then(function(apps) {
      $scope.application = _.find(apps, {_id: $stateParams.id});
      $scope.owners = ApplicationsManager.owners($scope.application.owners);
    });

    $scope.typeName = ApplicationsManager.typeName;
  });
