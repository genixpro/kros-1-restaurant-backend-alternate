'use strict';

var _ = require('lodash');
var Business = require('./business.model');

function placeholder(userId, application){

    var prefs = {
      createdBy: userId,
      business: {
        name: '',
        description: '',
        hours: {
          zone : 0, //GMT +x
          days :[{
            day :  1,
            openAt : new Date().getTime(),
            closeAt : new Date().getTime()
          }]
        },
        website: '',
        email: '',
        address: '',
        addressExtra: '',
        zipcode: '',
        latlong: '',
        zoom: ''
      },
      invoice: {
        name: '',
        organisationId: '',
        phone: '',
        email: '',
        address: '',
        addressExtra: '',
        area:'',
        zipcode: '',
        state: '',
      },
      contact: {
        name: '',
        phone: '',
        email: ''
      },
      orders: {
        discountPercentage: null,
        minimumOrder: null,
        preparationTime: null,
        disableOrders: false
      },
      settings: [
        {
          key: 'appearance.showImages',
          value: 'true',
          castType: 'boolean'
        }
      ],
      cuisines: [],
      media: [],
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      application: application
    }

    return prefs;
}

function find(userId, app, res){
  Business.find({
    application: app
  })
  .populate({
    path: 'createdBy',
    select: '-hashedPassword -salt -provider -__v',
    options: {
      weight: 1
    }
  })
  .populate('media')
  .exec(function (err, accounts) {
    if(err) { return handleError(res, err); }
      if(accounts.length < 1) {
        console.log("There is no account for this user yet. Let's create.")
        Business.create(placeholder(userId, app), function(err, accounts) {
          console.log("Initial accounts record created.")
          if(err) { return handleError(res, err); }
            return res.json(201, {result: [accounts]});
          });
        }else{
          return res.json(200, {result: accounts});
        }
      });
}

var pub = {

  index: function(req, res) {

    var applicationType = req.params.applicationType || req.query.applicationType;


    Business.find()
    .populate('media')
    .populate('application')
    .exec(function (err, businesses) {
      if(err) { return handleError(res, err); }

      // Filter businesses by restaurant application type

      var filtered = businesses.filter(function(business){
        console.log("Filter by application type" + business.application);
        return ((business.application !== null) && (business.application.type == applicationType)) ;
      });
      return res.json(200, {result: filtered});
    });

  },

  searchByTypeOwner: function(req, res){
    var businessOwner = req.params.owner;
    var applicationType = req.params.applicationType;

    Business.find()
    .populate('media')
    .populate('User')
    .populate({
      path: 'application',
      //  Populate by application type and owner
      match:  { type: applicationType, owners:businessOwner }
    })
    .exec(function (err, allBusinesses){
      if (err) {return handleError(res, err)}
      // Filter to ignore all null Business results
      var filtered = allBusinesses.filter(function(allBusinesses){
        return ((allBusinesses.application !== null)) ;
      });
      return res.status(200).json({result: filtered});
    });
  }
}

// Get public list of businesses
exports.public = pub

// Get list of accounts
exports.index = function(req, res) {
  return find(req.user._id, req.app, res);
};

// Get list of accounts
exports.find = function(req, res) {
  return find(req.params.user_id, req.app, res);
};

// Get a single accounts
exports.show = function(req, res) {
  Business.findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function (err, accounts) {
      if(err) {
        return handleError(res, err);
      }
      if(!accounts) {
        return res.send(404);
      }
      return res.json({result: accounts});
    });
};

// Creates a new accounts in the DB.
exports.create = function(req, res) {

  var body = req.body;

  body.createdAt = Date.now();
  body.modifiedAt = Date.now();

  console.log("Create prefs: " + body);

  Business.create(/*req.body*/ body, function(err, accounts) {
    if(err) { return handleError(res, err); }
    return res.json(201, accounts);
  });
};

// Updates an existing accounts in the DB.
exports.update = function(req, res) {
  // if(req.body._id) { delete req.body._id; }
  // Account.findById(req.params.id, function (err, accounts) {
  //   if (err) { return handleError(res, err); }
  //   if(!accounts) { return res.send(404); }
  //   var updated = _.merge(accounts, req.body);
  //   console.log("[accounts] body    : %o", req.body);
  //   console.log("[accounts] updated : %o", updated);
  //   updated.save(function (err) {
  //     if (err) { return handleError(res, err); }
  //     return res.json(200, {result: accounts});
  //   });
  // });

  var id = req.body._id;
  if(req.body._id) {
    delete req.body._id;
  }

  // CreatedBy is an full user's object.
  // we need just the user ID
  if(req.body.createdBy) {
    delete req.body.createdBy;
  }

  // Update the user
  req.body.createdBy = req.user._id;

  req.body.modifiedAt = Date.now();

  var data = req.body;
  console.log("Business update:", data);

  Business.findOneAndUpdate({
    _id: id
  }, data, function(err, doc) {
    if (err) {
      console.log("Business update error:", err);
      return res.json(500);
    } else {
      return res.json(200, {
        result: doc
      });
    }
  });
};

// Deletes a accounts from the DB.
// exports.destroy = function(req, res) {
//   Account.findById(req.params.id, function (err, accounts) {
//     if(err) { return handleError(res, err); }
//     if(!settings) { return res.send(404); }
//     accounts.remove(function(err) {
//       if(err) { return handleError(res, err); }
//       return res.send(204);
//     });
//   });
// };

function handleError(res, err) {
  console.log('[Businesses API] %o', err);
  return res.send(500, err);
}
