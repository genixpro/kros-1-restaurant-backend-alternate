'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  SimpleList = require('./simple-list.model');


// Get list of records
exports.index = function(req, res) {
  // Mogoose sort
  // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
  SimpleList.find({
      // createdBy: req.user._id
      // TODO: Comment this for tests. Uncomment for production
      application: req.app
    })
    .populate({
      path: 'createdBy',
      select: '-hashedPassword -salt -provider -__v',
    })
    .exec(function(err, records) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, {
        result: records
      });
    });
};

// Get a single record
exports.show = function(req, res) {
  SimpleList
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .exec(function(err, record) {
      if (err) {
        return handleError(res, err);
      }
      if (!record) {
        return res.send(404);
      }

      return res.json(200, {
        result: record
      });

    });
};

// Creates a new record in the DB.
exports.create = function(req, res) {
  if (req.body) {
    var data = {
      createdBy: req.user._id,
      name: req.body.name,
      body: req.body.body,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      application: req.app
    };

    SimpleList.create(data, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        url: 'http://localhost:80/api/simple-lists/' + doc._id,
        jsonrpc: '2.0',
        result: doc
      });
    });
  }
};

// Updates an existing category in the DB.
exports.update = function(req, res) {
  if (req.body && req.params.id) {
    var data = req.body;
    data.modifiedAt = Date.now();
    data.application = req.app;
    data.createdBy = data.createdBy._id ? data.createdBy._id : data.createdBy;
    delete data.__v
    delete data['_id'];

    SimpleList.findOneAndUpdate(
      {
      _id: req.params.id
      },
      data
    )
    .exec(function(err, doc) {
      if (err) {
        // return res.json(500);
        handleError(res, err);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/simple-lists/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a category from the DB.
exports.destroy = function(req, res) {
  SimpleList.findById(req.params.id, function(err, record) {
    if (err) {
      return handleError(res, err);
    }
    if (!record) {
      return res.send(404);
    }
    record.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
