'use strict';

var _ = require('lodash');
var db = require('mongoose');
var async = require('async');

var _destroyAll = destroyAll;

// Get list of posters
exports.index = function(req, res) {
  var _dataArr = {}
      ,_functionArr =[];

  var user_query = {
        role:{$ne: 'admin'}
      },
      other_query = {};

  _.forIn(db.models, function(value, key){
    _functionArr.push(function(cb){
      if(key == 'User'){
        value.find(user_query)
            .exec(function (err, data) {
              if(data.length) _dataArr[key]=data;
              cb(err, data)
            })
      }else{
        value.find(other_query)
            .exec(function (err, data) {
              if(data.length) _dataArr[key]=data;
              cb(err, data)
            })
      }
    })

  });
  async.parallel(_functionArr, function(err, result){
    res.json(201, {res: result, err: err, data: _dataArr})
  });
};

// Creates a new poster in the DB.
exports.update = function(req, res) {
  var _data = req.body
      ,_functionArr =[]
      ,_query = {
        createdBy: req.user._id
      };

  async.waterfall([
      function(callback){
        _destroyAll(req, res, callback)
      }],
      function(err, result){

        _.forIn(_data, function(value, key){
          //add data
          value.forEach(function(el){
            // not allow to create users  with role of the administrator, for security reasons
            if(key == 'User' && el.role=='admin'){
              return;
            }
            _functionArr.push(function(cb){
              db.models[key].create(el, function(err, data) {
                cb(err, data)
              })
            })
          })
        });

        async.parallel(_functionArr, function(err, result){
          res.json(201, {res: result, err: err})
        });
      }
  )
};


function handleError(res, err) {
  return res.send(500, err);
}

// Deletes all data from the DB, except admin.
function destroyAll(req, res, callback) {
  var user_query = {
        role:{$ne: 'admin'}
      }
      , _functionArr =[]
      , other_query = {};

  _.forIn(db.models, function(value, key){
    _functionArr.push(function(cb){
      if(key == 'User'){
        value.remove(user_query, function (err, data) {
          cb(err, data);
        })
      }else{
        value.remove(other_query, function (err, data) {
          cb(err, data);
        })
      }
    })
  });

  async.parallel(_functionArr, function(err, result){
    callback (err, result)
  });

}
