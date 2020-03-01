'use strict';

var config = require('../../config/environment');

var _ = require('lodash'),
  mongoose = require('mongoose'),
  SubmissioncodesOrder = require('./submissioncodes-order.model'),
  User = require('./../user/user.model'),
  async = require('async');

/*
 * TODO: Enable this code. Isolate it within a method

var ipRange = config.submissionCode.whiteIPRanges.split(',');

var ipRange = ipRange.map(function (e) {
  var value = e.trim().toLowerCase();
  return value;
});

var cmUrl = config.submissionCode.cmUrl;
var cpUrl = config.submissionCode.cpUrl;

*
*/

var pub = {
  index: function (req, res) {

    // Mogoose sort
    // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
    SubmissioncodesOrder.find({
      createdBy: req.params.createdBy
    })
      .populate({
        path: 'createdBy',
        select: ' -email -role -hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .exec(function (err, submissioncodesOrders) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(200, {
          result: submissioncodesOrders
        });
      });
  }
};

// Get list of categorys
exports.public = pub;

// Get list of categorys
exports.index = function (req, res) {
  console.log('SCD: ' + JSON.stringify(req.query));
  var _query = {};
  var _regex = {$regex: req.query.search, $options: 'i'};
  if (req.query.search) {
    _query =
      {
        $or: [
          {productId: _regex},
          {name: _regex},
          {email: _regex},
          {abstractId: _regex},
          {submissionCode: _regex},
          {purchaseId: _regex}
        ]
      };
  }
  if (req.query.email) {
    _query = {$or: [{email: req.query.email}, {additionalEmails: req.query.email}]};
  }
  // if (req.query.email || true) {
  console.log('paginate: ' + JSON.stringify(_query));
  SubmissioncodesOrder.paginate({
    query: _query,
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 3,
    sort: {
      date: -1
    }
  }, function (err, provider) {
    if (err) {
      return handleError(res, err);
    }
    // console.log('Provider.docs: '+JSON.stringify(provider.docs));
    res.json(200, {
      page: provider.page,
      page_size: provider.limit,
      total: provider.docs.length,
      num_pages: provider.pages,
      result: provider.docs
    });
  });
  // }
  // else {
  //   // query.createdBy = req.user._id;
  //   SubmissioncodesOrder.find(_query)
  //     .populate({
  //       path: 'createdBy',
  //       select: '-hashedPassword -salt -provider -__v',
  //       options: {
  //         weight: 1
  //       }
  //     })
  //     .exec(function(err, submissioncodesOrders) {
  //       if (err) {
  //         return handleError(res, err);
  //       }
  //       return res.json(200, {
  //         result: submissioncodesOrders
  //       });
  //     });
  // }


};

// Get a single category
exports.show = function (req, res) {
  SubmissioncodesOrder
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .exec(function (err, submissioncodesOrder) {
      if (err) {
        return handleError(res, err);
      }
      if (!submissioncodesOrder) {
        return res.send(404);
      }

      return res.json(200, {
        result: submissioncodesOrder
      });
    });
};

// Creates a new category in the DB.
exports.create = function (req, res) {

  if (req.body) {
    var submissioncodesOrderData = req.body;

    submissioncodesOrderData.createdBy = req.user._id;

    SubmissioncodesOrder.create(submissioncodesOrderData, function (err, doc) {
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
exports.update = function (req, res) {
  if (req.body && req.params.id) {
    var data = req.body;
    data.createdBy = data.createdBy && data.createdBy._id ? data.createdBy._id : data.createdBy;
    delete data.__v;
    delete data['_id'];
    if (data.additionalEmails && data.additionalEmails.length && data.additionalEmails[0].val) {
      data.additionalEmails = data.additionalEmails.map(function (d) {
        return d.val;
      });
    }

    SubmissioncodesOrder.findOneAndUpdate({
      _id: req.params.id
    }, data, function (err, doc) {
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
exports.destroy = function (req, res) {
  SubmissioncodesOrder.findById(req.params.id, function (err, submissioncodesOrder) {
    if (err) {
      return handleError(res, err);
    }
    if (!submissioncodesOrder) {
      return res.send(404);
    }
    submissioncodesOrder.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

/*
 * TODO: Enable this code. Isolate it within a method

// var ip_list = ['192.168.88.247', 'http://testdomain2.com:5097', '127.0.0.1','http://localhost:9000/api/downloads/','::ffff:127.0.0.1','::1']
var whiteIPList = config.submissionCode.whiteIPList;
// Split
// http://www.w3schools.com/jsref/jsref_obj_string.asp
var ip_list = whiteIPList.split(',');

var ip_list = ip_list.map(function (str) {
  var value = str.trim();
  return value;
});

*
*/

exports.fastspring = function (req, res) {

  // if (ip_list.indexOf(req.connection.remoteAddress) == -1 && ip_list.indexOf(req.get('origin')) == -1) {
  //   console.log('SubmissioncodesOrder controller:: The remote address is not part of the white list: ' + req.connection.remoteAddress);
  //   console.log('SubmissioncodesOrder controller:: The request origin is not part of the white list: ' + req.get('origin'));
  //   // return res.send(401);
  //   return res.status(401).send('Sorry, we cannot authorize: ' + req.connection.remoteAddress + ' ' + req.get('origin'));
  // }

  if (!req.body.email || !req.body.name) {
    return res.send(500, {err: 'No required fields'});
  }

  var newOrder = new SubmissioncodesOrder({
    purchaseId: req.body.reference,
    runningNo: req.body.subscriptionReference,
    purchaseDate: new Date(),
    productId: req.body.internalProductName,
    quantity: req.body.quantity,
    name: req.body.name,
    // lastname : req.body.LASTNAME,
    // firstname : req.body.FIRSTNAME,
    email: req.body.email,
    // additionalEmails : req.body.additionalEmails, πως είναι η μορφη τους;
    abstractId: req.body.abstractId,
    submissionCode: '',
    sourceKey: req.body.sourceKey,
    sourceCampaign: req.body.sourceCampaign,
    test: req.body.test
  });

  if (req.params.confKey) var fastSpringURL = 'http://' + req.params.confKey + cmUrl;

  async.waterfall([
    function (callback) {

      console.log('Generate KEY.');
      console.log('CP URL: ' + fastSpringURL);

      var request = require('request');
      request({
          uri: fastSpringURL,
          method: "POST",
          form: {'REG_NAME': newOrder.name, 'ADDITIONAL1': newOrder.abstractId}
        },
        function (error, response, body) {
          callback(null, body);
        });
    },
    function (body, callback) {
      newOrder.submissionCode = body;
      console.log('<------->', newOrder);
      callback(null);
    }

  ], function (err) {
    if (err) {
      return res.send(500, {err: JSON.stringify(err)});
    }
    //TODO CreatedBy
    newOrder.save(function (err) {
      if (err) return console.error(err);
      console.log("**Order Saved**")
    });
    res.type('text/plain');
    res.send(200, newOrder.submissionCode);
  });

  // async.waterfall([
  //   function (cb) {
  //     console.log('Generate KEY.');
  //     console.log('CP URL: ' + fastSpringURL);

  //     var request = require('request');
  //     request({
  //       uri: shareItURL,
  //       method: "POST",
  //       form: {'REG_NAME': newOrder.name, 'ADDITIONAL1': newOrder.abstractId}
  //     },
  //     function(error, response, body) {
  //       cb(null,body);
  //     });
  //   },
  //   function (order, cb) {
  //     User.findOne({email: newOrder.email}, function (err, user) {
  //       return cb(err, order, user);
  //     })
  //   },
  //   function (order, user, cb) {
  //     if (user) {
  //       return cb(null, order)
  //     }
  //     else {
  //       var user = {
  //         email: newOrder.email,
  //         name: newOrder.name,
  //         password: generateNewPassword()
  //       }
  //       User.create(user, function (err, user) {
  //         return cb(err, order)
  //       })
  //     }
  //   }
  // ], function (err, data) {
  //   if (err) {
  //     return res.send(500, {err: JSON.stringify(err)});
  //   }
  //   res.send(200, {result: data})
  // })

};

exports.shareit = function (req, res) {

  // if (ip_list.indexOf(req.connection.remoteAddress) == -1 && ip_list.indexOf(req.get('origin')) == -1) {
  //   console.log('Remote address: '+ req.connection.remoteAddress);
  //   console.log('Remote origin: '+ req.get('origin'));
  //   return res.send(401);
  // }

  // heroku uses load balancers so the original caller is always on the x-forwarded-for header
  // req.ip remains so that the code dont break when the request doesnt pass from proxies
  var remoteIP = req.get('x-forwarded-for') || req.ip;

  if (!isIPinRange(remoteIP, ipRange)) {
    console.log('Remote IP .....: ' + req.ip);
    console.log('Remote address : ' + req.connection.remoteAddress);
    console.log('Remote origin .: ' + req.get('origin'));
    console.log('Remote x-forwarded-for .: ' + req.get('x-forwarded-for'));
    return res.send(401);
  }

  console.log(req.body);

  if (!req.body.EMAIL || !req.body.REG_NAME) {
    return res.send(500, {err: 'No required fields'});
  }

  var newOrder = new SubmissioncodesOrder({
    purchaseId: req.body.PURCHASE_ID,
    runningNo: req.body.RUNNING_NO,
    purchaseDate: new Date(),
    productId: req.body.PRODUCT_ID,
    quantity: req.body.QUANTITY,
    name: req.body.REG_NAME,
    // lastname : req.body.LASTNAME,
    // firstname : req.body.FIRSTNAME,
    email: req.body.EMAIL,
    // additionalEmails : req.body.additionalEmails, πως είναι η μορφη τους;
    street: req.body.STREET,
    city: req.body.CITY,
    zip: req.body.ZIP,
    country: req.body.COUNTRY,
    notes: '',
    // languageId : req.body.LANGUAGE_ID,
    // iso : req.body.ISO_CODE,
    // nAllow : req.body.NLALLOW,
    abstractId: req.body.ADDITIONAL1,
    submissionCode: ''
  });

  if (req.params.confKey == 'nans2017') {
    var shareItURL = 'http://' + req.params.confKey + cpUrl;
  } else {
    var shareItURL = 'http://' + req.params.confKey + cmUrl;
  }

  // TODO waterfall:
  //   1. Call CP and get back submissionCode
  //   2. Set newOrder's submissionCode and serialize
  async.waterfall([
    function (callback) {
      // TODO: call cp and get back the submisison code
      //       eg: http://asa2016.cp.eposterslive.com/seam/resource/key?REG_NAME=%22testing%22&ADDITIONAL1=2602


      console.log('Generate KEY.');
      console.log('CP URL: ' + shareItURL);

      var request = require('request');
      request({
          uri: shareItURL,
          method: "POST",
          form: {'REG_NAME': newOrder.name, 'ADDITIONAL1': newOrder.abstractId}
        },
        function (error, response, body) {
          callback(null, body);
        });
    },
    function (body, callback) {
      newOrder.submissionCode = body;
      console.log('<------->', newOrder);
      callback(null);
    }

  ], function (err) {
    if (err) {
      return res.send(500, {err: JSON.stringify(err)});
    }
    //TODO CreatedBy
    newOrder.save(function (err) {
      if (err) return console.error(err);
      console.log("**Order Saved**")
    });
    res.type('text/plain');
    res.send(200, newOrder.submissionCode);
  });
};

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

function isIPinRange(ip, range) {

  var inRange = _.find(range, function (el) {
    return ip.includes(el);
  });

  return !!inRange;
}
