'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  PlatformOrder = require('./platform-order.model'),
  User = require('./../user/user.model'),
  async = require('async');
  
  
  

var pub = {
  index: function(req, res) {
  
    // Mogoose sort
    // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
    PlatformOrder.find({
        createdBy: req.params.createdBy
      })
      .populate({
        path: 'createdBy',
        select: ' -email -role -hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .exec(function(err, platformOrders) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, {
          result: platformOrders
        });
      });
  }
};

// Get list of categorys
exports.public = pub;

// Get list of categorys
exports.index = function(req, res) {
  var query = {
//    createdBy: req.user._id
  }
  if (req.query.email) {
    query['$or'] = [
      {email: req.user.email},
      {additionalEmails: req.user.email}
    ]
    PlatformOrder.paginate({
      query: query,
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      sort: {
        date: -1
      }
    }, function(err, provider) {
      if (err) {
        return handleError(res, err);
      }
      res.json(200, {
        page: provider.page,
        page_size: 10,
        total: provider.docs.length,
        num_pages: provider.pages,
        result: provider.docs
      });
    });
  }
  else {
    query.createdBy = req.user._id;
    PlatformOrder.find(query)
      .populate({
        path: 'createdBy',
        select: '-hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .exec(function(err, platformOrders) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, {
          result: platformOrders
        });
      });
  }
  

};

// Get a single category
exports.show = function(req, res) {
  PlatformOrder
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .exec(function(err, platformOrder) {
      if (err) {
        return handleError(res, err);
      }
      if (!platformOrder) {
        return res.send(404);
      }

      return res.json(200, {
        result: platformOrder
      });

    });
};

// Creates a new category in the DB.
exports.create = function(req, res) {

  if (req.body) {
    var platformOrderData = req.body
    
    platformOrderData.createdBy = req.user._id

    PlatformOrder.create(platformOrderData, function(err, doc) {
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
    if (data.additionalEmails && data.additionalEmails.length && data.additionalEmails[0].val) {
      data.additionalEmails = data.additionalEmails.map(function(d) {
        return d.val
      })
    }
    
    PlatformOrder.findOneAndUpdate({
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
  PlatformOrder.findById(req.params.id, function(err, platformOrder) {
    if (err) {
      return handleError(res, err);
    }
    if (!platformOrder) {
      return res.send(404);
    }
    platformOrder.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};


var ip_list = ['192.168.88.247', 'http://testdomain2.com:5097', '127.0.0.1']

exports.fastspring = function (req, res) {

  if (ip_list.indexOf(req.connection.remoteAddress) == -1 && ip_list.indexOf(req.get('origin')) == -1) {
    return res.send(401);
  }
  if (!req.body.email || !req.body.name) {
    return res.send(500, {err: 'No required fields'});
  }
  var newOrder = {}
  newOrder.purchaseId = req.body.reference;
  newOrder.runningNo = req.body.subscriptionReference;
  newOrder.purchaseDate = {
    date: new Date()
  }
  newOrder.productId = req.body.internalProductName;
  newOrder.quantity = req.body.quantity;
  newOrder.name = req.body.name;
  newOrder.company = req.body.company;
  newOrder.email = req.body.email;
  
  async.waterfall([
    function (cb) {
      PlatformOrder.create(newOrder, function (err, order) {
        return cb(err, order);
      })
    },
    function (order, cb) {
      User.findOne({email: newOrder.email}, function (err, user) {
        return cb(err, order, user);
      })
    },
    function (order, user, cb) {
      if (user) {
        return cb(null, order)
      }
      else {
        var user = {
          email: newOrder.email,
          name: newOrder.name,
          password: generateNewPassword()
        }
        User.create(user, function (err, user) {
          return cb(err, order)
        })
      }
    }
  ], function (err, data) {
    if (err) {
      return res.send(500, {err: JSON.stringify(err)});
    }
    res.send(200, {result: data})
  })
  
}


function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}

function generateNewPassword() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4().substring(2);
}
