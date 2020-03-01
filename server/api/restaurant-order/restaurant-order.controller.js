'use strict';

var _ = require('lodash');
var RestaurantOrder = require('./restaurant-order.model');
var Business = require('../business/business.model');
var config = require('./../../config/environment');
var email = require('../../components/email');

var pub = {
  create: function(req, res) {
    console.log("post received" + JSON.stringify(req.body));

    RestaurantOrder.create(req.body, function(err, order) {
      if(err) { return handleError(res, err); }
      return res.json(201, {result: order});
    });
  }
};

var getBusiness = function(application, cb){
  console.log('Entering getBusiness for application' + application);
  var query = {
      application : application
    };
  Business.findOne(query, function(err, business){
    console.log('Found Business: ' + JSON.stringify(business));
    cb(err, business);
  })
};

// Get list of categorys
exports.public = pub;

// Get list of orders
exports.index = function(req, res) {
  // Order.find(function (err, orders) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(200, {result: orders});
  // });

  var query = {
      // userId: req.user._id
      application : req.app
    }

  if (req.query.status) query.status = req.query.status;

  RestaurantOrder.paginate({
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

};

// Get a single order
exports.show = function(req, res) {
  RestaurantOrder.findById(req.params.id, function (err, order) {
    if(err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    // return res.json(order);
    return res.json(200, {result: order});
  });
};

// Creates a new order in the DB.
exports.create = function(req, res) {
  req.body.application =  req.app
  RestaurantOrder.create(req.body, function(err, order) {
    if(err) { return handleError(res, err); }
    // Notify Business
    notifyBusinessForNewOrder(req.app, order);
    // Notify User
    sendCreatedEmail(req.app, order);
    return res.json(201, {result: order});
  });
};

// Updates an existing order in the DB.
exports.update = function(req, res) {
  var data = req.body

  if(data._id) delete data._id;
  if(data.__v) delete data.__v;

  req.body.application =  req.app;

  RestaurantOrder.findOneAndUpdate({
    _id: req.params.id
  }, data, {new: true}, function(err, order) {
    if (err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    return res.json(200, {result: order});
  })

//  RestaurantOrder.findById(req.params.id, function (err, order) {
//    if (err) { return handleError(res, err); }
//    if(!order) { return res.send(404); }
//    var updated = _.merge(order, req.body);
//    updated.save(function (err) {
//      if (err) { return handleError(res, err); }
//      return res.json(200, {result: order});
//    });
//  });
};

// Deletes a order from the DB.
exports.destroy = function(req, res) {
  RestaurantOrder.findById(req.params.id, function (err, order) {
    if(err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    order.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// populate the information for dashboards
exports.summary = function(req, res) {
  RestaurantOrder.getSummary(req.user._id.toString(), function(err, result) {
    if (err) {
      return handleError(res, err);
    }
    if (!result) {
      return res.send(404);
    }

    return res.send(200, result);
  });
}

exports.getInterval = function(req, res) {
  // If there is no interval value set as ENV variable use the default value of 0
  var defaultIntevalValue = 0;

  var interval = config.refreshInterval ? config.refreshInterval : defaultIntevalValue;

  return res.json(200, {result: interval});
}

exports.orderChangeStatusNotify = function (req, res) {
  console.log('orderChangeStatusNotify')

  if (!req.query || !req.query.email || !req.query.friendlyID || !req.query.status) {
    return res.send(500, 'Incorrect params!');
  }
  var from = 'support@appseed.io';
  var to = req.query.email;
  var subject = 'Your Order ' + req.query.friendlyID;
  var body = 'The status of your order changed to ' + req.query.status;
  email.sendEmail(from, to, subject, body);
  return res.send(200);
}


exports.orderCreatedNotify = function (req, res) {
  if (!req.query || !req.query.email || !req.query.friendlyID) {
    return res.send(500, 'Incorrect params!');
  }
  sendCreatedEmail(req.query.email, req.query.friendlyID);
  return res.send(200);
}

function sendCreatedEmail (application, order) {
  var from = 'support@appseed.io';
  var to = order.shipping.email;
  var orderID = order.friendlyID;

  var subject = 'Your Order ' + orderID;
  var body = 'You order is received';

  getBusiness(application, function(err, business){
    console.log('RestaurantOrderController::sendCreatedEmail:: Error    :  ' + JSON.stringify(err));
    console.log('RestaurantOrderController::sendCreatedEmail:: Business : ' + JSON.stringify(business));
    if (!err){
      if(business && business.orders.preparationTime){
        body = 'You order is received and will be delivered within ' + business.orders.preparationTime + ' minutes.';
      }
      email.sendEmail(from, to, subject, body);
    }
  });
}

function notifyBusinessForNewOrder (application, order) {
  var from = 'support@appseed.io';
  var orderID = order.friendlyID;
  var subject = 'Appseed Restaurant - New Order: ' + orderID;
  var body = '<p>A new order is received. Order ID: ' + orderID + '</p>' +
             '<hr>' +
             '<p>Please follow this link to login: <a href="http://my.appseed.io">my.appseed.io</a></p>';
  getBusiness(application, function(err, business){
    if (!err){
      if(business && business.contact.email){
        console.log('Notify Business for new order: ' + business.contact.email + ' / ' + order.friendlyID);
        var to = business.contact.email;
        email.sendEmail(from, to, subject, body);
      }
    }
  });
}

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
