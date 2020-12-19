'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var async = require('async');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var User = require('../api/user/user.model');
var Client = require('../api/client/client.model');
var Application = require('../api/application/application.model');
var validateJwt = expressJwt({
  secret: config.secrets.session
});

/**
 * Check whether the user credentials is exist or not.
 * @param {String} userId - user identifier
 * @returns {Function} cb will return the object contained the user details if
 *  the user is exist
 */
function checkUser(userId) {
  return function(cb) {
    User.findById(userId, function(err, user) {
      if(err) {
        return cb(err);
      }

      if(!user) {
        return cb(null, null);
      }

      cb(null, user);
    });
  }
}

/**
 * Check whether the user credentials is exist or not.
 * @param {String} userId - user identifier
 * @returns {Function} cb will return the object contained the user details if
 *  the user is exist
 */
function checkClient(userId) {
  return function(cb) {
    console.log('auth.service: checkClient()');
    Client.findById(userId)
      .populate({
        path: 'createdBy',
        select: ' -email -role -hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .exec(function(err, client) {
        if(err) {
          return cb(err);
        }

        if(!client) {
          return cb(null, null);
        }

        cb(null, client.createdBy);
      });
  }
}

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated(isAnonymousPermitted) {

  return compose()
    // Validate jwt
    .use(function(req, res, next) {
      console.log('auth.service: isAuthenticated(): Validate jwt')
      // console.log('// req :' + JSON.stringify(req.headers));

      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }

      // allow anonymous access if requested
      // anonymous access is enamled only when not authorization token exists
      // in the header. If there is we are handling the request as normal passing it
      // through the JWT validation.
      //
      // For time being only one page requires anonymous access:
      // http://localhost:80/schedule-public
      //
      // console.log('Check authorization with isAnonymousPermitted : ' + isAnonymousPermitted);
      // console.log('Check authorization with referer ............ : ' + req.headers.referer);

      function endsWith(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
      }

      if(!(req.headers.authorization) && isAnonymousPermitted && req.headers.referer && endsWith(req.headers.referer, '/welcome')){
        // allow anonymous access
        // console.log('Authorization: Is not available. But anonymous access is required.');
        req.user = { provider: 'FORCE_PUBLIC' };
        req.headers.app_id = config.publicAppId;
        next();

        return;
      }

      console.log('auth.service: isAuthenticated: Validate jwt');
      validateJwt(req, res, next);

    })
    // Attach user to request
    .use(function(req, res, next) {

      // Force public access. No need to attach user to the request
      if (req.user.provider == 'FORCE_PUBLIC') {
        // console.log('// Force public access. No need to attach user to request');
        next();

        return;
      }

      // console.log('// Attach user to request');
      // check the crendentials in Client and User in parallel
      async.parallel({
        user: checkUser(req.user._id),
        client: checkClient(req.user._id)
      }, function(err, results) {
        if(err) {
          return next(err);
        }

        if(!results.user && !results.client) {
          return res.send(401);
        }

        if(results.user) {
          // console.log('results.user:' + results.user);
          req.user = results.user;
          next();
        }

        if(results.client) {
          req.user = results.client;
          next();
        }
      });


    });
}

/**
 * A helper function to run the minimum requirements checks
 */
function isRoleAuthorized(roleRequired) {
  return function(req, res, next) {
    var currentUserRole = config.userRoles.indexOf(req.user.role),
      requiredRole = config.userRoles.indexOf(roleRequired),
      authorized = (currentUserRole >= requiredRole);

    if(authorized) {
      next();
    } else {
      res.send(403);
    }
  }
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if(!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(isRoleAuthorized(roleRequired));
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({
    _id: id
  }, config.secrets.session, {
    expiresInMinutes: 60 * 5
  });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if(!req.user) return res.json(404, {
    message: 'Something went wrong, please try again.'
  });
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

/**
 * Checks if current user can access the requested app
 */
function canAccessApp() {
  return compose()
    .use(function(req, res, next) {
      var app = req.headers.app_id || req.query.app_id || req.body.app_id;
      if(!app) return next();

      Application.findById(app, function(err, application) {
        if(err) { return res.send(401); }
        if(!application) { return res.send(404); }

        if(application.owners.indexOf(req.user._id) > -1) {
          req.app = app;
          return next();
        }

        return res.send(401);
      });
    });
}

exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;
exports.canAccessApp = canAccessApp;
