'use strict';
/**
 * @description executed when the transition of route 'api/posters-lint/..'
 */

/**
 * third-party files and modules
 */
var _ = require('lodash');
var Poster = require('../poster/poster.model');
var Room = require('../room/room.model');
var async = require('async');
var moment = require('moment');
var methodsOfPosters = require('../poster/poster.controller');
var methodsOfRooms = require('../room/room.controller');

/**
 * @description function for preparing data for requests
 */
var _getSessionsNumber = getSessionsNumber;
var _getCountPoster = getCountPoster;
var _countValue = countValue;
/**
 * @description function for database requests
 */
var _getRooms = getRooms;


/**
 * @description called when in to the server comes a request: get('api/posters-lint/sessions/empty')
 *              Get number of the empty sessions
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 */
exports.getEmpty = function(req, res) {
  _getSessionsNumber(req, res, 'empty')
};

/**
 * @description called when in to the server comes a request: get('api/posters-lint/sessions/overflown')
 *              Get number of the overflown sessions
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 */
exports.getOverflown = function(req, res) {
  _getSessionsNumber(req, res, 'overflown')
};

/**
 * @description called when in to the server comes a request: get('api/posters-lint/posters/non-assigned')
 *              Get number of the non-assigned posters
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - the resulting data set
 */
exports.getNonAssigned = function(req, res) {
  var _where = {
    createdBy: req.headers.app_id,
    monitor: -1,
    room: null
  };
  _getCountPoster(req, res, _where).then(function(result){
    res.json(200,{result: result.length ? result[0].count : 0})
  });
};

/**
 * @description called when in to the server comes a request: get('api/posters-lint/summary')
 *              Get total number of the empty sessions, of the non-assigned posters and of the overflown sessions a single request
 *              function prepares the data by calling a functions "_getCountPoster" and "_getRooms" and "_getCountPoster";
 *              processes the data by calling the function "_countValue" and returns its result
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - the resulting data set
 */
exports.summaryData = function(req, res) {
  var _asyncPosters = function(cb){
    var _where = { createdBy: req.headers.app_id },
        _field = {room: '$room', monitor: '$monitor'},
        _count = { $sum: 1 };
    _getCountPoster(req, res, _where, _field, _count).then(function(result){
      cb(null, result)
    })
  };

  var _asyncRooms = function(cb){
    _getRooms(req, res).then(function(result){
      cb(null, result)
    })
  };

  var _asyncNonAssigned = function(cb){
    var _where = {
      createdBy: req.headers.app_id,
      monitor: -1,
      room: null
    };
    _getCountPoster(req, res, _where).then(function(result){
      cb(null, result)
    });
  };

  return async.parallel([_asyncPosters, _asyncRooms, _asyncNonAssigned],function(err, result){
    /**
     * result[0] - callback of the first function (_asyncPosters) in array containing functions to run
     * result[1] - callback of the second function (_asyncRooms) in array containing functions to run
     * result[2] - callback of the second function (_asyncNonAssigned) in array containing functions to run
     */
    var _posters = result[0],
        _rooms = result[1],
        _result =  {};

    var _posters_overflown = _countValue(_rooms, _posters, 'overflown')
        , _posters_empty = _countValue(_rooms, _posters, 'empty');

    _result.SessionsOverflown = _posters_overflown.count || 0;
    _result.SessionsEmpty = _posters_empty.count || 0;
    _result.PostersNonAssigned = result[2].length ? result[2][0].count : 0;
    _result.stateRoom = {
      overflown: _posters_overflown.stateRoom,
      empty: _posters_empty.stateRoom
    };

    res.json(200, {result: _result})
  })
};

/**
 * @description function for error handling
 *
 * @function handleError
 *
 * @param {Object} res - is an object containing information about the HTTP request that raised the event.
 * @param err - server error to send back HTTP response.
 *
 * @return {Object} - error
 */
function handleError(res, err) {
  return res.send(500, err);
}

/**
 * @description function prepares the data by calling  "methodsOfPosters.distinctAndCountPosters";
 *
 * @function getCountPoster
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {Object} [where = { createdBy: req.headers.app_id }] - specifies selection criteria using query operators.
 * @param {(String | Object)} [field = null] - the name of the field on which will be counted unique values.
 * @param {Object} [count = { $sum: 1 }] - parameter which will be set as the count of unique values.
 *
 * @return {Object} -the resulting data set
 */
function getCountPoster(req, res, where, field, count){
  var _where = where || { createdBy: req.headers.app_id },
      _count = count || { $sum: 1 },
      _field = field || null;

  return methodsOfPosters.distinctAndCountPosters(req, res, _where, _field, _count)
}

/**
 * @description function prepares the data by calling a functions "_getCountPoster" and "_getRooms";
 *              processes the data by calling the function "_countValue" and returns its result
 *
 * @function getSessionsNumber
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {String} [type = ('empty' | 'overflown')] - specifies selection criteria using query operators.
 *
 * @return {Object} -the resulting data set
 */
function getSessionsNumber(req, res, type){
  var _asyncPosters = function(cb){
    var _where = { createdBy: req.headers.app_id },
        _field = {room: '$room', monitor: '$monitor'},
        _count = { $sum: 1 };
    _getCountPoster(req, res, _where, _field, _count).then(function(result){
      cb(null, result)
    })
  };

  var _asyncRooms = function(cb){
    _getRooms(req, res).then(function(result){
      cb(null, result)
    })
  };

  return async.parallel([_asyncPosters, _asyncRooms],function(err, result){
    /**
     * result[0] - callback of the first function (_asyncPosters) in array containing functions to run
     * result[1] - callback of the second function (_asyncRooms) in array containing functions to run
     */
    var _posters = result[0],
        _rooms = result[1],
        _result =  _countValue(_rooms, _posters, type)
    res.json(200, {result: _result.count})
  })
}

/**
 * @description function prepares the data by calling  "methodsOfRooms.getRooms";
 *
 * @function getRooms
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -the resulting data set
 */
function getRooms(req,res){
  var _where = { createdBy: req.headers.app_id };

  return methodsOfRooms.getRooms(req, res, _where)
}

/**
 * @description for each room checks each monitor for the presence of posters and if found doing check by type ('empty' | 'overflown')
 *              It counts the number 'empty' or 'overflown' of rooms
 *
 * @function countValue
 *
 * @param {Array} rooms - collection of rooms.
 * @param {Array} posters - collection of posters.
 * @param {String} [type = ('empty' | 'overflown')] - type of which is checked room
 *
 * @return {Object} Number of rooms satisfying "type"
 */
function countValue(rooms, posters, type){
  var count = 0
      , stateRoom = [];

  rooms.forEach(function(room){
    var existRoom = 0,
        overflownMonitor = 0,
        emptyMonitor = 0,
        available = (room.availability[0].endDate - room.availability[0].startDate),
        duration = room.presentationDuration*60*1000;
    posters.forEach(function(poster){
      if(poster._id.room && poster._id.room.toString() == room._id.toString()){
        room.monitors.forEach(function(monitor){
          if(poster._id.monitor == room.monitors.indexOf(monitor)){
            existRoom++;
            if(available/duration < poster.count){
              overflownMonitor++;
            }
            if(available/duration > poster.count){
              emptyMonitor++;
            }
          }
        })
      }
    })
    if(existRoom < room.monitors.length){
      emptyMonitor++;
    }
    if(overflownMonitor && type == 'overflown'){
      count++;
      stateRoom.push({room: room._id, state: type})
    }
    if(emptyMonitor && type == 'empty'){
      count++;
      stateRoom.push({room: room._id, state: type})
    }
  })
  return {count: count, stateRoom: stateRoom};
}
