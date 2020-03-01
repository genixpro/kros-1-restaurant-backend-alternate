'use strict';

var _ = require('lodash');
var Application = require('./application.model');


function createApplicationforUser(userId, callback){
  var app = {
    name: 'My restaurant',
    type: 'restaurant',
    owners: [userId]
  }

  app.createdBy = userId;
  app.createdAt = Date.now();
  app.modifiedAt = Date.now();

  Application.create(app, function(err, application) {
    if(err) {
      console.log('An error occured:' + err);
      callback(err, null);
    }
    console.log('Applicatio created: ' + JSON.stringify(application));
    callback(null, application);
  });
}

// Get list of applications for the current user
exports.index = function(req, res) {
  console.log('Requested list of applications for user: ' + JSON.stringify(req.user));
  Application.find({owners: req.user._id}, function(err, applications) {
    // Create a default app if no apps exist for this user (owner)
    if (applications.length < 1) {
      console.log('There are no Application available for this user.');
      console.log('lets create one...');
      createApplicationforUser(req.user._id, function(err, app){
        if(err) { return handleError(res, err); }
        console.log('Application created: ' + JSON.stringify(app));
        applications.push(app);
        return res.json(200, applications);
      });

    }else{
      if(err) { return handleError(res, err); }
      return res.json(200, applications);
    }
    // if(err) { return handleError(res, err); }
    // return res.json(200, applications);
  });
};

// Get a single application
exports.show = function(req, res) {
  Application.findById(req.params.id, function(err, application) {
    if(err) { return handleError(res, err); }
    if(!application) { return res.send(404); }
    return res.json(application);
  });
};

// Creates a new application in the DB.
exports.create = function(req, res) {
  // tracking data
  req.body.createdBy = req.user._id;
  req.body.createdAt = Date.now();
  req.body.modifiedAt = Date.now();

  Application.create(req.body, function(err, application) {
    if(err) { return handleError(res, err); }
    return res.json(201, application);
  });
};

// Updates an existing application in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  if(req.body.__v) { delete req.body.__v; }
  Application.findById(req.params.id, function(err, application) {
    if(err) { return handleError(res, err); }
    if(!application) { return res.send(404); }

    var updated = _.merge(application, req.body);
    updated.modifiedAt = Date.now(); // tracking...

    // owners
    updated.owners = [];
    req.body.owners.forEach(function(ownerId) {
      updated.owners.push(ownerId);
    });
    
    updated.save(function(err) {
      if(err) { return handleError(res, err); }
      return res.json(200, application);
    });
  });
};

// Deletes a application from the DB.
exports.destroy = function(req, res) {
  Application.findById(req.params.id, function(err, application) {
    if(err) { return handleError(res, err); }
    if(!application) { return res.send(404); }
    application.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(JSON.stringify(err));
  return res.send(500, err);
}
