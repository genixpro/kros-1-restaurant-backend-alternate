'use strict';

angular.module('newsApp')
  .service('Applications', function($resource) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    return $resource('/api/applications/:id', null, {'update': {method: 'PUT'}});  // notice the full address including id
  })
  .service('ApplicationsManager', function($rootScope, $log, User, Auth, Applications) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    var currentUser = Auth.getCurrentUser();
    var owners = [{email: 'Me', id: currentUser._id, me: true, success: true}]; // me!

    var types = [
      // TODO: Add more application types
      // {key: 'restaurant', name: 'Restaurant'},
      // {key: 'conference', name: 'Conference'},
      // {key: 'lectures', name: 'Video lectures and Quizes'},
      // {key: 'local-business', name: 'Local business'},
      {key: 'catalogue', name: 'Catalogue'},
      {key: 'restaurant', name: 'Restaurant'}
    ];

    // the service obj
    var srv = {
      applications: Applications.query(), // shared object
      currentUser: currentUser,
      types: types
    };

    // get app type name by app type key
    srv.typeName = function(typeKey) {
      if(!typeKey) return null;
      var type = _.find(types, {key: typeKey});
      return type.name;
    };

    // get app owners emails
    srv.owners = function(ownerIds) {
      owners = [{email: 'Me', id: srv.currentUser._id, me: true, success: true}]; // me!
      _.forEach(ownerIds, function(ownerId) {
        if(ownerId != currentUser._id) { // not me!
          User.get({id: ownerId}, function(owner) {
            owners.push({email: owner.email, id: owner._id, success: true});
          });
        }
      });
      return owners;
    };

    // validates owner
    srv.checkOwner = function(owner) {
      if(!owner.email) {
        owner.success = false;
        owner.error = false;
        delete owner.id;
      }
      else {
        User.getByEmail({id: currentUser._id, email: owner.email}, function(res) {
          // success
          owner.success = true;
          owner.error = false;
          owner.id = res._id;
        }, function() {
          // error
          owner.success = false;
          owner.error = true;
          delete owner.id;
        });
      }
    };

    // listen for user login
    $rootScope.$on('auth:login', function() {
      console.log('ApplicationsManager: on auth:login');
      srv.applications = Applications.query(); // refresh applications
      srv.currentUser = Auth.getCurrentUser(); // refresh current user
    });

    return srv;
  });
