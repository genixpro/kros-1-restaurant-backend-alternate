'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Category = require('./category.model');

var pub = {
  index: function(req, res) {
    // Mogoose sort
    // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
    Category.find({
        createdBy: req.params.createdBy
      })
      .sort({weight: 1})
      .populate({
        path: 'createdBy',
        select: ' -email -role -hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .populate('media')
      .exec(function(err, categorys) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, {
          result: categorys
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
  Category.find({
      //createdBy: req.user._id
      application: req.app
    })
    .sort({weight: 1})
    .populate({
      path: 'createdBy',
      select: '-hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .populate('media')
    .exec(function(err, categorys) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, {
        result: categorys
      });
    });
};

// Get a single category
exports.show = function(req, res) {
  Category
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, category) {
      if (err) {
        return handleError(res, err);
      }
      if (!category) {
        return res.send(404);
      }

      return res.json(200, {
        result: category
      });

    });
};

// Creates a new category in the DB.
exports.create = function(req, res) {
  if (req.body) {
    var categoryData = {
      createdBy: req.user._id,
      name: req.body.name,
      description: req.body.description,
      weight: req.body.weight,
      media: req.body.media,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      application: req.app
    };

    Category.create(categoryData, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        url: 'http://localhost:3000/api/categories/' + doc._id,
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
    delete data['_id']

    Category.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        // return res.json(500);
        handleError(res, err);
      } else {
        if(doc === null) {
          handleError(res, new Error("Failed to update category."))
        }
        return res.json(200, {
          url: 'http://localhost/api/categories/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a category from the DB.
exports.destroy = function(req, res) {
  Category.findById(req.params.id, function(err, category) {
    if (err) {
      return handleError(res, err);
    }
    if (!category) {
      return res.send(404);
    }
    category.remove(function(err) {
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
