'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Dowmload = require('./download.model');

var pub = {
  index: function(req, res) {
    // Mogoose sort
    // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
    Dowmload.find({
        createdBy: req.params.createdBy
      })
      .populate({
        path: 'createdBy',
        select: ' -email -role -hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .populate('media')
      .exec(function(err, downloads) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, {
          result: downloads
        });
      });
  }
};

// Get list of categorys
exports.public = pub;

// Get list of categorys
exports.index = function(req, res) {
  // Mogoose sort
  // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
  Dowmload.find({
      createdBy: req.user._id
    })
    .populate({
      path: 'createdBy',
      select: '-hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .exec(function(err, downloads) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, {
        result: downloads
      });
    });
};

// Get a single category
exports.show = function(req, res) {
  Dowmload
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .exec(function(err, download) {
      if (err) {
        return handleError(res, err);
      }
      if (!download) {
        return res.send(404);
      }

      return res.json(200, {
        result: download
      });

    });
};

// Creates a new category in the DB.
exports.create = function(req, res) {

  if (req.body) {
    var downloadData = req.body
    
    downloadData.createdBy = req.user._id

    Dowmload.create(downloadData, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        url: 'http://localhost:9000/api/downloads/' + doc._id,
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
    data.createdBy = data.createdBy._id ? data.createdBy._id : data.createdBy;
    delete data.__v
    delete data['_id']
    
    Dowmload.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        // return res.json(500);
        handleError(res, err);
      } else {
        return res.json(200, {
          url: 'http://localhost:9000/api/downloads/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a category from the DB.
exports.destroy = function(req, res) {
  Dowmload.findById(req.params.id, function(err, download) {
    if (err) {
      return handleError(res, err);
    }
    if (!download) {
      return res.send(404);
    }
    download.remove(function(err) {
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
