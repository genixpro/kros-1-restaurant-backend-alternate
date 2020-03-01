'use strict';
/**
 * @description executed when the transition of route 'api/rooms' 'api/rooms/:id'
 */

/**
 * third-party files and modules
 */
var _ = require('lodash');
var Room = require('./room.model');
var Poster = require('../poster/poster.model');
var async = require('async');
var methodsOfPosters = require('../poster/poster.controller');

/**
 * @description function for preparing data for requests
 */
var _unique_Function = unique_Function;
var _findAllRooms_Function = findAllRooms_Function;
var _paginate_Function = paginate_Function;
var _findTotalNumberRooms_Function = findTotalNumberRooms_Function;
var _allOfSummaryRooms_Function = allOfSummaryRooms_Function;
var _checkState_Function_Function = checkState_Function;

/**
 * @description function for database requests
 */
var _distinctRoom_Function = distinctRoom_Function;
var _distinctAndCountRoom_Function = distinctAndCountRoom_Function;
var _findRoom_Function = findRoom_Function;

exports.getRooms = _findRoom_Function;
/**
 * @description called when in to the server comes a request: get('api/rooms')
 *              depending on the 'query' parameters calls one of the functions for preparing data
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 */
exports.index = function(req, res) {

  if (req.query.page == null) {

    switch(true){
      /**
       * @description selects a unique value by req.query.field(unique request)
       */
      case (!!req.query.field):
        _unique_Function(req, res);
        break;
      /**
       * @description select total_number rooms by req.query.total_number(query request)
       */
      case (!!req.query.total_number):
        _findTotalNumberRooms_Function(req, res);
        break;
      /**
       * @description select summary rooms by req.query.summary(query request)
       */
      case (!!req.query.summary):
        _allOfSummaryRooms_Function(req, res);
        break;
      /**
       * @description select all rooms(query request)
       */
      default:
        _findAllRooms_Function(req, res)
    }

  }
  else {
    /**
     * @description page navigation by req.query.page(query request)
     */
    var _query = {
      createdBy: req.headers.app_id
    };

    /**
     * @description filtering by category and search (they can be used together) by req.query.category, req.query.search (query request)
     */
    if (req.query.category) {
      _query.category = req.query.category;
    }
    if (req.query.search) {
      var _regex = {$regex: req.query.search, $options: 'i'};
      _query.title = _regex
    }

    var _page = parseInt(req.query.page) || 1;
    _paginate_Function(req, res, _query, _page);
  }

};

/**
 * @description called when in to the server comes a request: get('api/rooms/:id')
 *              Get a single room
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -error or found room
 */
exports.show = function(req, res) {
  Room.findOne({
    _id: req.params.id,
    createdBy: req.headers.app_id
  }, function (err, room) {
    if(err) { return handleError(res, err); }
    if(!room) { return res.send(404); }
    return res.json(200, room);
  });
};

/**
 * @description called when in to the server comes a request: post('api/rooms/')
 *              Creates a new room in the DB.
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -error or create room
 */
exports.create = function(req, res) {
  if (req.body) {

    var data = req.body,
        duration = data.presentationDuration * 60 * 1000;

    data.createdBy = req.headers.app_id;
    data.createdAt = Date.now();
    data.modifiedAt = Date.now();

    if (data.availability[0].startDate + duration > data.availability[0].endDate){
      data.availability[0].endDate = data.availability[0].startDate + duration;
    }

    Room.create(data, function(err, room) {
      if(err) { return handleError(res, err); }
      return res.json(201, room);
    });

  };
};

/**
 * @description called when in to the server comes a request: post('api/rooms/:id') or patch('api/rooms/:id')
 *              Updates an existing room in the DB.
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -error or updated room
 */
exports.update = function(req, res) {
  if (req.body) {
    var data = req.body,
        duration = data.presentationDuration * 60 * 1000;
    data.modifiedAt =  Date.now();

    if (data.availability[0].startDate + duration > data.availability[0].endDate){
      data.availability[0].endDate = data.availability[0].startDate + duration;
    }

    Room.findOneAndUpdate({
      _id: data._id
    }, data, function(err, room) {
      if (err) {
        return res.json(500);
      } else {
        return res.json(200,
           room);
      }
    });
  }
};

/**
 * @description called when in to the server comes a request: delete('api/rooms/:id')
 *              Deletes a room from the DB.
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - code operation
 */
exports.destroy = function(req, res) {
  Room.findById(req.params.id, function(err, room) {
    if (err) {
      return handleError(res, err);
    }
    if (!room) {
      return res.send(404);
    }
    room.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      Poster.update({room:req.params.id},{$set: {room:null, monitor: -1, startDate: null, duration:0}}, {multi: true}, function(err, result){
        if(!err) {
          return res.send(204);
        }else{
          return res.send(500);        
        }
      })
    });
  });

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
 * @description function prepares the data and calls a function "_distinctRoom_Function" with that data
 *
 * @function unique_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - the resulting data set
 */
function unique_Function(req, res) {
  var _field = req.query.field;

  _distinctRoom_Function(req, res, _field).then(function(result){
    return res.json(200, {
      result : result
    });
  })
}

/**
 * @description function prepares the data and calls a function "_distinctAndCountRoom_Function" with that data
 *
 * @function findTotalNumberRooms_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - the resulting data set
 */
function findTotalNumberRooms_Function(req, res) {
  var _field = null;
  if(req.query.total_number !== 'all'){
    _field = req.query.total_number;
  }
  var _count = {$sum: 1};
  _distinctAndCountRoom_Function(req, res, _field, _count).then(function(result){
    return res.json(200, {
      result : result
    });
  })
}

/**
 * @description function for database requests (Room.distinct())
 *
 * @function distinctRoom_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {String} field - the name of the field on which will be counted unique values.
 *
 * @return {Promise} - database requests, which returns {Object} -the resulting data set
 */
function distinctRoom_Function(req, res, field) {
  var _where = {
    createdBy: req.headers.app_id
  };
  return  Room.distinct(field, _where)
      .exec(function (err, rooms) {
        if(err) { return handleError(res, err); }
        return  rooms
      });
}

/**
 * @description function for database requests (Room.aggregate())
 *
 * @function distinctAndCountRoom_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {String} [field = null] - the name of the field on which will be counted unique values.
 * @param {Object} [count = {$sum:1}] - parameter which will be set as the count of unique values.
 *
 * @return {Promise} - database requests, which returns {Object} -the resulting data set
 */
function distinctAndCountRoom_Function(req, res, field, count) {
  var _where = {
    createdBy: req.headers.app_id
  };
  var _count = count || {$sum:1}
  var _field = field ? '$'+field : null;
  return  Room.aggregate(
          [ {
            $match : _where
          },
            {
              $group : {_id: _field, count: _count}
            }
          ])
      .exec(function (err, rooms) {
        if(err) { return handleError(res, err); }
        return  rooms
      });
}

/**
 * @description function prepares the data by calling a functions "_findRoom_Function" and "methodsOfPosters.distinctAndCountPosters";
 *              processes the data by calling the function "_checkState_Function_Function" and returns its result
 *
 * @function findAllRooms_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -the resulting data set
 */
function findAllRooms_Function(req, res) {
  var _asyncRoom = function(cb){
    var _where = {
      createdBy: req.headers.app_id
    };
    if(req.query.category){
      _where.category = req.query.category;
    }

    _findRoom_Function(req, res, _where).then(function(result){
      cb(null, result);
    })
  };

  var _asyncPoster = function(cb){
    var _where = {createdBy: req.headers.app_id},
        _field = {room: '$room', monitor: '$monitor'},
        _count =  { $sum: 1 };
    methodsOfPosters.distinctAndCountPosters(req, res, _where, _field, _count).then(function(result){
      cb(null, result);
    })
  };

  async.parallel([_asyncRoom, _asyncPoster], function(err, result){
    /**
     * result[0] - callback of the first function (_asyncRoom) in array containing functions to run
     * result[1] - callback of the second function (_asyncPoster) in array containing functions to run
     */
    var _rooms = result[0],
        _posters = result[1],
        _result =  _checkState_Function_Function(_rooms, _posters),
        _filteredRerult = [];

    if(req.query.state){
      _result.forEach(function(room){
        if(room.fillState.indexOf(req.query.state.toLowerCase()) != -1){
          _filteredRerult.push(room)
        }
      })
    }else{
      _filteredRerult = _result;
    }
    return res.json(200, {
      result : _filteredRerult
    });
  })
}


/**
 * @description function for database requests (Room.find())
 *
 * @Important: exported and used in other files
 *
 * @function findRoom_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {Object} where - specifies selection criteria using query operators.
 * @param {Object} [sort = {'availability.startDate': 1}] - option by which to sort the results.
 *
 * @return {Promise} - database requests, which returns {Object} -the resulting data set
 */
function findRoom_Function(req, res, where, sort) {
  var _sort =sort || {'availability.startDate': 1};

  return  Room.find(where)
      .sort( _sort )
      .exec(function (err, rooms) {
        if(err) { return handleError(res, err); }
        return rooms
      });
}

/**
 * @description function prepares the data by calling a functions "_distinctAndCountRoom_Function" and "_distinctRoom_Function";
 *              groups the returned data
 *
 * @function allOfSummaryRooms_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -the resulting data set. Contains fields: result.totalNumber_rooms, result.totalNumber_rooms_by_categories, result.totalNumber_categories
 */
function allOfSummaryRooms_Function(req, res) {
  var _asyncTotalNumberRooms_all = function(cb){
    var _field = null;
    var _count = {$sum: 1};
    _distinctAndCountRoom_Function(req, res, _field, _count).then(function(result){
      cb(null, result)
    })
  };

  var _asyncTotalNumberRooms_byCategories = function(cb){
    var _field = 'category';
    var _count = {$sum: 1};
    _distinctAndCountRoom_Function(req, res, _field, _count).then(function(result){
      cb(null, result)
    })
  };


  var _asyncTotalNumberCategories = function(cb){
    var _field = 'category';

    _distinctRoom_Function(req, res, _field).then(function(result){
      cb(null, result)
    })
  };

  async.parallel([_asyncTotalNumberRooms_all, _asyncTotalNumberRooms_byCategories, _asyncTotalNumberCategories],function(err, result){
    var _result = {};
    _result.totalNumber_rooms = result[0];
    _result.totalNumber_rooms_by_categories = result[1];
    _result.totalNumber_categories = result[2];

    res.json(200, {result: _result})
  })
}

/**
 * @description function for database requests (Room.paginate())
 *
 * @function paginate_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {Object} data - specifies selection criteria using query operators.
 * @param {Number} page - number of pages.
 *
 * @return {Object} -the resulting data set. Contains fields: page, page_size, total, num_pages, result
 */
function paginate_Function(req, res, data, page) {

  Room.paginate({
    query: data,
    page: page,
    limit: parseInt(req.query.limit) || 10,
    sort: {
      'availability.startDate': 1
    }
  }, function(err, provider) {
    if (err) {
      return handleError(res, err);
    }

    if(!provider.docs.length && page != 1){
      return _paginate_Function(req, res, data, page-1)
    }

    res.json(200, {
      page: provider.page,
      page_size: 5,
      total: provider.docs.length,
      num_pages: provider.pages,
      result: provider.docs
    });
  });
}


/**
 * @description check how many posters assigned to each monitor in the room and fills the field "fillState" ('overflown' or 'empty') in accordance with this check
 *
 * @function checkState_Function
 *
 * @param {Array} rooms - collection of rooms.
 * @param {Array} posters - collection of posters.
 *
 * @return {Array} -Change collection of rooms
 */
function checkState_Function(rooms, posters){

  rooms.forEach(function(room){
    var emptyMonitor = 0,
        overflownMonitor = 0,
        existMonitor = 0,
        available = (room.availability[0].endDate - room.availability[0].startDate),
        duration = room.presentationDuration*60*1000,
        count = available/duration;
    posters.forEach(function(poster){
      if(poster._id.room && poster._id.room.toString() == room._id.toString()){
        room.monitors.forEach(function(monitor){
          if(poster._id.monitor == room.monitors.indexOf(monitor)){
            existMonitor++;
            if(count < poster.count){
              overflownMonitor++;
            }
            if(count > poster.count){
              emptyMonitor++;
            }
          }
        })
      }

    })
    if(existMonitor< room.monitors.length){
      emptyMonitor++;
    }
    room.fillState = [];
    if(overflownMonitor){
      room.fillState.push('overflown');
    }
    if(emptyMonitor){
      room.fillState.push('empty');
    }
  })
  return rooms;
}

