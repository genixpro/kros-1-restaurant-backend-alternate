'use strict';
/**
 * @description executed when the transition of route 'api/posters' 'api/posters/:id'
 */

/**
 * third-party files and modules
 */
var _ = require('lodash');
var Poster = require('./poster.model');
var async = require('async');
var moment = require('moment');
var bitbucket = require('bitbucket-api');
var config = require('../../config/environment');

/**
 * @description function for preparing data for requests
 */
var _unique_Function = unique_Function;
var _paginate_Function = paginate_Function;
var _findPostersByRoom_Function = findPostersByRoom_Function;
var _findAllPosters_Function = findAllPosters_Function;
var _findPostersByStartEndTime_Function = findPostersByStartEndTime_Function;
var _findTotalNumberPosters_Function = findTotalNumberPosters_Function;
var _renderAllFilteredPosters_Function_Function = renderAllFilteredPosters_Function;
var _allOfSummaryPosters_Function = allOfSummaryPosters_Function;
var _distinctAndCountPosters_Function = distinctAndCountPosters_Function;
var _distinctAndCountPostersUnassigned_Function = distinctAndCountPostersUnassigned_Function;
/**
 * @description function for database requests
 */
var _findPosters_Function = findPosters_Function;
var _distinctPosters_Function = distinctPosters_Function;
var _distinctAndCountPosters = distinctAndCountPosters;
var _getPresentationTypes=getPresentationTypes;

exports.distinctAndCountPosters = _distinctAndCountPosters;
exports.findPosters_Function = _findPosters_Function;
exports.getPresentationTypes=_getPresentationTypes;

/**
 * @description called when in to the server comes a request: get('api/posters')
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
       * @description select posters by ROOM req.query.room_id(query request)
       */
      case (!!req.query.room_id):
        _findPostersByRoom_Function(req, res);
        break;
      /**
       * @description select posters by date(between 'date_start' and 'date_end') req.query.date_start, req.query.date_end(query request)
       */
      case (!!req.query.date_start && !!req.query.date_end):
        _findPostersByStartEndTime_Function(req, res)
        break;
      /**
       * @description select total_number posters by req.query.total_number(query request)
       */
      case (!!req.query.total_number):
        _findTotalNumberPosters_Function(req, res)
        break;
      /**
       * @description select summary posters by req.query.summary(query request)
       */
      case (!!req.query.summary):
        _allOfSummaryPosters_Function(req, res)
        break;
      /**
       * @description select all posters(query request)
       */
      default:
        _findAllPosters_Function(req, res)
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
     * @description filtering by presentation type, assigned, search, room, date_start & date_end (they can be used together)
     * by req.query.presentationType, req.query.assigned, req.query.search, req.query.room, req.query.date_start && req.query.date_end (query request)
     */
    if (req.query.presentationType) {
      _query.presentationType = req.query.presentationType;
    }
    if (req.query.assigned == 'false') {
      _query.$and = [];
      _query.$and.push(
        {$or : [
          {monitor : -1},
          {room : null },
          {room: {$exists:false}},
          {startDate: null},
          {startDate: {$exists:false}}
        ]}
      )
    }
    if (req.query.canceled== 'false') {
      _query.$and = _query.$and || [];
      _query.$and.push(
        {$or : [
        {isCanceled:false},
        {isCanceled: {$exists:false}}
        ]}
      );
    }
    if (req.query.search) {
      _query.$and = _query.$and || [];
      var _regex = {$regex: req.query.search, $options: 'i'};
      _query.$and.push(
        {$or : [
          {title : _regex},
          {authors :{ $elemMatch :{firstName: _regex}}},
          {authors :{ $elemMatch :{lastName: _regex}}},
          {authors :{ $elemMatch :{institution: _regex}}},
          {code : _regex}
        ]}
      )
    }
    if (req.query.room) {
      _query.room = req.query.room;
    }
    if (req.query.date_start && req.query.date_end) {

      _query.$and = _query.$and || [];
      _query.$and.push(
        {startDate: {$gte: req.query.date_start}},
        {startDate: {$lte: req.query.date_end}}
      )
    }
    if (req.query.no_empty) {
      _query.$and = _query.$and || [];
      _query.$and.push({presentationType : {$not: /empty/i}});
    }

    if(req.query.page == 'all'){
      _renderAllFilteredPosters_Function_Function(req,res,_query)
    }else{
      var _page = parseInt(req.query.page) || 1;
      _paginate_Function(req, res, _query, _page);
    }
  }
};

/**
 * @description function calling a function "_findPosters_Function" with incoming data, the returned data it processes and groups
 *              returns rendered with this data page
 *
 * @function renderAllFilteredPosters_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {Object} query - the name of the field on which will be counted unique values.
 *
 * @return {Promise} - render page, which returns {Object} -the resulting data set
 */
function renderAllFilteredPosters_Function(req, res, query){
  _findPosters_Function(res, query).then(function(result){

    var _result = _.reject(result, function(item){ return item.presentationType&&!!~item.presentationType.toLowerCase().indexOf('empty') });
    var _collection = _.chain(_result)
        .map(function(e){
          var startDate = fixTimezone(e.startDate, req.query.timezone);

          e.currentDate = moment(new Date(startDate)).format('MMM DD, YYYY - hh:mm a');
          e.sortDate = moment(new Date(startDate)).format('MMM DD, YYYY');
          return e
        })
        .groupBy(function(n){
          return n.presentationType
        })
        .mapValues(function(n){
          return _.groupBy(n, function(l){
            return l.sortDate
          })
        })
        .value();

    res.render('print.ejs', {data: _collection, moment: moment}, function(err, html){
          if(err) { return handleError(res, err); }
          return res.json(200, {
            result : html
          });
        }
    )
  })

}

function fixTimezone(dateTime, timezone) {
  if (!dateTime) {
    return null;
  }

  timezone = parseInt(timezone) || 0;
  var dt = new Date(dateTime);
  dt.setMinutes(dt.getMinutes() + dt.getTimezoneOffset());
  dt.setMinutes(dt.getMinutes() + timezone);
  return dt.getTime();
};

/**
 * @description called when in to the server comes a request: get('api/posters/:id')
 *              Get a single poster
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -error or found poster
 */
exports.show = function(req, res) {
  Poster.findOne({
    _id: req.params.id,
    createdBy: req.headers.app_id
  }, function (err, poster) {
    if(err) { return handleError(res, err); }
    if(!poster) { return res.send(404); }
    return res.json(poster);
  });
};

/**
 * @description called when in to the server comes a request: post('api/posters/')
 *              Creates a new poster / posters in the DB.
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -error and the result of the recording of the poster / posters
 */
//
exports.create = function(req, res) {
  var _dataArr = []
      ,_functionArr =[];

  if (req.body) {
    _dataArr.push(req.body);
    if(req.body instanceof Array) _dataArr = req.body;

    _dataArr.forEach(function(el){
      //create array functions for async request
      _functionArr.push(function(cb){
        var data = el;
        data.createdBy = req.headers.app_id;
        data.createdAt = Date.now();
        data.modifiedAt = Date.now();

        Poster.create(data, function(err, poster) {
          cb(err, poster)
        });
      })
    });
    async.parallel(_functionArr, function(err, result){
      res.json(201, {res: result, err: err})
    });
  }
};

/**
 * @description called when in to the server comes a request: post('api/posters/batch-actions/clear-assigments')
 *              Clear assignments for all posters where 'createdBy'.
 *
 * @function clearAssignments
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -error and the result of the recording of the poster / posters
 */
exports.clearAssignments = function(req, res) {
  Poster.update({ createdBy: req.headers.app_id},{$set: {room:null, monitor: -1, startDate: null, duration:0}}, {multi: true}, function(err, result){
    res.json(200, {result: result})
  })
};

/**
 * @description called when in to the server comes a request: post('api/posters/:id') or patch('api/posters/:id')
 *              Updates an existing poster / posters in the DB.
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -error and the result of the updating of the poster / posters
 */

exports.update = function(req, res) {
  var _dataArr = []
      ,_functionArr =[];

  if (req.body) {

    _dataArr.push(req.body);
    if(req.body instanceof Array) _dataArr = req.body;

    _dataArr.forEach(function(el){
      //create array functions for async request
      _functionArr.push(function(cb){
        var data = el;
        data.modifiedAt = Date.now();
        Poster.findOne({_id:data._id},function(err,poster){
          var oldPoster=poster;
          Poster.findOneAndUpdate({
            _id: data._id
          }, data,  function(err, newPoster) {
            cb(err, newPoster);
            createBitbucketIssue(req,res,newPoster,oldPoster,'update');
          });
        });
      })
    });
    async.parallel(_functionArr, function(err, result){
      res.json(201, {res: result, err: err})
    });

  }
};

/**
 * @description called when in to the server comes a request: delete('api/posters/:id')
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
  Poster.findById(req.params.id, function (err, poster) {
    if(err) { return handleError(res, err); }
    if(!poster) { return res.send(404); }
    var newPoster='was deleted';
    createBitbucketIssue(req,res,newPoster,poster,'delete');
    poster.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};


/**
 * @description called when in to the server comes a request: delete('api/posters')
 *              Deletes all poster from the DB.
 *
 * @function unName
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - code operation
 */
exports.destroyAll = function(req, res) {
  var _where = {
    createdBy: req.headers.app_id
  };
  Poster.remove(_where, function(err) {
    if(err) { return handleError(res, err); }
    return res.send(204);
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
 * @description function prepares the data and calls a function "_distinctAndCountPosters_Function" with that data
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
//  var _count = {$sum: 1};

//  if(req.query.count == 'all'){
//    _count = {$sum: 1};
    ((req.query.count == 'all') ? _distinctAndCountPostersUnassigned_Function(req, res) : _distinctAndCountPosters_Function(req, res, _field))
      .then(function(result){
        console.log('unique_Function() req.query.count: ' + req.query.count);
        console.log('unique_Function() result: ' + JSON.stringify(result));
        return res.json(200, {
          result : result
        });
      })
//  }
}

/**
 * @description function prepares the data and calls a function "_distinctAndCountPosters_Function" with that data
 *
 * @function findTotalNumberPosters_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - the resulting data set
 */
function findTotalNumberPosters_Function(req, res) {
  var _field = null;
  if(req.query.total_number !== 'all'){
    _field = req.query.total_number;
  }
  var _count = {$sum: 1};
  _distinctAndCountPosters_Function(req, res, _field, _count).then(function(result){
    return res.json(200, {
      result : result
    });
  })
}

/**
 * @description function prepares the data and calls a function "_findPosters_Function" with that data
 *
 * @function findPostersByRoom_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - the resulting data set
 */
function findPostersByRoom_Function(req, res) {
  var _where = {
    room: req.query.room_id,
    createdBy: req.headers.app_id
  };

  _findPosters_Function(res, _where).then(function(result){
    return res.json(200, {
      result : result
    });
  })
}

/**
 * @description function prepares the data and calls a function "_findPosters_Function" with that data
 *
 * @function findAllPosters_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - the resulting data set
 */
function findAllPosters_Function(req, res) {
  var _where = {
    createdBy: req.headers.app_id
  };

  _findPosters_Function(res, _where).then(function(result){
    return res.json(200, {
      result : result
    });
  })
}

/**
 * @description function prepares the data and calls a function "_findPosters_Function" with that data
 *
 * @function findPostersByStartEndTime_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} - the resulting data set
 */
function findPostersByStartEndTime_Function(req, res) {
  var _where = {
    createdBy: req.headers.app_id,
    $and: [
      {startDate: {$gte: req.query.date_start}},
      {startDate: {$lt: req.query.date_end}}
    ]
  };

  _findPosters_Function(res, _where).then(function(result){
    return res.json(200, {
      result : result
    });
  })
}

/**
 * @description function prepares input data for distinctAndCountPosters() (database requests  - Poster.aggregate())
 *
 * @function distinctAndCountPosters_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {(String | Object)} [field = null] - the name of the field on which will be counted unique values.
 * @param {Object} [count = {$sum: {$ifNull: [ "$room",  1] }] - parameter which will be set as the count of unique values.
 *
 * @return {Promise} - database requests, which returns {Object} -the resulting data set
 */
function distinctAndCountPosters_Function(req, res, field, count) {
  console.log('distinctAndCountPosters_Function(): app_id: ' + req.headers.app_id);
  console.log('distinctAndCountPosters_Function(): field: ' + field);

  var _where = {
    createdBy: req.headers.app_id
  };
  var _count = count || {$sum: {$ifNull: [ "$room",  1] } }
  var _field = null;
  if(field && typeof(field) === 'string') _field = '$'+field;
  if(field instanceof Object) _field = field;
  return _distinctAndCountPosters(req, res, _where,_field, _count);
}

/**
 * @description function prepares input data for distinctAndCountPosters() (database requests  - Poster.aggregate())
 *
 * @function distinctAndCountPostersUnassigned_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {(String | Object)} [field = null] - the name of the field on which will be counted unique values.
 * @param {Object} [count = {$sum: 1}] - parameter which will be set as the count of unique values.
 *
 * @return {Promise} - database requests, which returns {Object} -the resulting data set
 */
function distinctAndCountPostersUnassigned_Function(req, res) {
    var _where =
    {$and:[
      {createdBy:req.headers.app_id},
      { $or:[
        { room: null },
        { room: {$exists:false}},
        { monitor: -1 },
        { monitor: {$exists:false}},
        { startDate: {$exists:false}},
        { startDate: null},
      ]}
    ]}
  var _count = {$sum: 1 }
  var field = req.query.field || null;
  var _field = null;
  if(field && typeof(field) === 'string') _field = '$'+field;
  if(field instanceof Object) _field = field;
  return _distinctAndCountPosters(req, res, _where,_field, _count)
}

/**
 * @description function for database requests (Poster.aggregate())
 *
 * @Important: exported and used in other files
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {Object} _where - input data for $match
 * @param {Object} _field - input data for $group (_id)
 * @param {Object} _count - input data for $group (count)
 *
 * @return {{}|Promise|Array|{index: number, input: string}|*|Object}
 */
function distinctAndCountPosters(req, res, _where,_field, _count){

  console.log('distinctAndCountPosters(): _where: ' + JSON.stringify(_where));
  console.log('distinctAndCountPosters(): _field: ' + JSON.stringify(_field));
  console.log('distinctAndCountPosters(): _count: ' + JSON.stringify(_count));

  return  Poster.aggregate(
    [ {
      $match : _where
    },
      {
        $group : {_id: _field, count: _count}
      }
    ])
    .exec(function (err, posters) {
      if(err) { return handleError(res, err); }
      console.log('distinctAndCountPosters(): posters: ' + JSON.stringify(posters));
      return  posters
    });
}




/**
 * @description function for database requests (Poster.find())
 *
 * @function findPosters_Function
 *
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {Object} where - specifies selection criteria using query operators.
 * @param {Object} [sort = { code: 1 }] - option by which to sort the results.
 *
 * @return {Promise} - database requests, which returns {Object} -the resulting data set
 */
function findPosters_Function(res, where, sort) {
  var _sort =sort || { code: 1 };

  return  Poster.find(where)
      .sort( _sort )
      .populate('room')
      .exec(function (err, posters) {
        if(err) { return handleError(res, err); }
        return posters
      });
}


/**
 * @description function prepares the data by calling a functions "_distinctAndCountPosters_Function" and "_distinctPosters_Function";
 *              groups the returned data
 *
 * @function allOfSummaryPosters_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -the resulting data set. Contains fields: result.totalNumber_posters, result.totalNumber_posters_by_presentationType, result.totalNumber_presentationTypes
 */
function allOfSummaryPosters_Function(req, res) {
  var _asyncTotalNumberPosters_all = function(cb){
    var _field = null;
    var _count = {$sum: 1};
    _distinctAndCountPosters_Function(req, res, _field, _count).then(function(result){
      cb(null, result)
    })
  };

  var _asyncTotalNumberPosters_byPresentationType = function(cb){
    var _field = 'presentationType';
    var _count = {$sum: 1};
    _distinctAndCountPosters_Function(req, res, _field, _count).then(function(result){
      cb(null, result)
    })
  };


  var _asyncTotalNumberPresentationType = function(cb){
    var _field = 'presentationType';

    _distinctPosters_Function(req, res, _field).then(function(result){
      cb(null, result)
    });
  };

  async.parallel([_asyncTotalNumberPosters_all, _asyncTotalNumberPosters_byPresentationType, _asyncTotalNumberPresentationType],function(err, result){
    var _result = {};
    _result.totalNumber_posters = result[0];
    _result.totalNumber_posters_by_presentationType = result[1];
    _result.totalNumber_presentationTypes = result[2];

   res.json(200, {result: _result})
  })
}

/**
 * @description function for database requests (Poster.distinct())
 *
 * @function distinctPosters_Function
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 * @param {String} field - the name of the field on which will be counted unique values.
 *
 * @return {Promise} - database requests, which returns {Object} -the resulting data set
 */
function distinctPosters_Function(req, res, field) {
  var _where = {
    createdBy: req.headers.app_id
  };
  return  Poster.distinct(field, _where)
      .exec(function (err, posters) {
        if(err) { return handleError(res, err); }
        return  posters
      });
}

/**
 * @description function for database requests (Poster.paginate())
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

  Poster.paginate({
    query: data,
    page: page,
    limit: parseInt(req.query.limit) || 10,
    sort: {
      code: 1
    }
  }, function(err, provider) {
    if (err) {
      return handleError(res, err);
    }

    if(!provider.docs.length && page != 1){
      return _paginate_Function(req, res, data, page-1)
    }

    var _provider = provider;


    // Populate rooms
    Poster.populate(provider.docs, {
          path: 'room',
          model: 'Room'
        },
        function(err, posters){
          if (err) {
            return handleError(res, err);
          }

          //
          // count all the results that are satisfying the query
          //
          Poster.count(data).exec(function (err, result) {
              if(err) { return handleError(res, err); }

              var _total_all = result;
              console.log('all the records result : ' + JSON.stringify(result));

              res.json(200, {
                page: _provider.page,
                page_size: 5,
                total: _provider.docs.length,
                total_all: _total_all,
                num_pages: _provider.pages,
                result: _provider.docs
              });
          });

        });

  });
}

function createBitbucketIssue(req,res,newData,oldData,type){
  if(config.bitbucket.isEnabled && (config.bitbucket.isEnabled == 'true' || config.bitbucket.isEnabled == 1)){
    console.log('Logging in Bitbucket is enabled.');
    console.log('Creating an issue ...');
  }else{
    console.log('Logging in Bitbucket is not enabled.');
    return;
  }
  var credentials = {username: config.bitbucket.username, password: config.bitbucket.password};
  var client = bitbucket.createClient(credentials);
  var repository = client.getRepository({slug: config.bitbucket.slug, owner: config.bitbucket.owner}, function (err,repo) {
    if(err) {
      console.log('err',err);
      return;
    }
    if(!repo){
      console.log('No Bitbucket repository found/returned');
      return;
    }
    if(!oldData){
      console.log('No oldDate object provided.');
      return;
    }

    //  Title: {poster.id} - {poster.title} [{action (update|delete)}
    //Body: before: {Poster.toJSON} - after: {Poster.toJSON}

    var title = '[' + oldData._id + '] ' + oldData.title + ' - Action: ' + type;
    // var body = '##before:##\n\n```\n' + oldData + '\n```\n\n##after##\n\n```\n' + newData + '\n```'
    var body = '##before:##'
             + '\n\n```\n'
             + oldData
             + '\n```\n\n'
             + '##after##'
             + '\n\n```\n'
             + newData
             + '\n```\n\n'
             + '##headers##'
             + '\n\n```\n'
             + JSON.stringify(req.headers)
             + '\n```\n\n'
             + '##user##'
             + '\n\n```\n'
             + JSON.stringify(req.user)
             + '\n```' ;

    var issue = {
        title: title,
        content: body
    };

    repo.issues().create(issue,function(err,resp) {
      if(err) console.log('err',err)
    })
  });
}
function getPresentationTypes(req,res){

  return Poster.find({createdBy:req.headers.app_id})
    .distinct('presentationType')
     .exec(function (err, types) {
      if(err) { return handleError(res, err); }
      var result= _.map(types,function(e){return {_id:e,count:''}});
      return res.json(200, {
        result : result
      });
    });

}
