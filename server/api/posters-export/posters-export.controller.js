'use strict';

var json2csv = require('json2csv');
var fs = require('fs');
var moment = require('moment');
var posterController = require('../poster/poster.controller');
var path = require('path');

var exportArray = [];

exports.exportPosters = function(req, res) {
  exportArray = [];
  var _query = {
    createdBy: req.headers.app_id
  };
  handlingData(req, res, _query, createExportData_Poster)
};

exports.exportSchedule = function(req, res) {
  exportArray = [];
  var _query = {
    createdBy: req.headers.app_id,
    presentationType: {$not: /empty/i}
  };
  if (req.query.presentationType) {
    _query.$and = _query.$and || [];
    _query.$and.push({presentationType : req.query.presentationType});
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
  handlingData(req, res, _query, createExportData_Schedule)
};

exports.delete = function(req, res) {

  fs.unlinkSync(req.query.delUrl);
  res.send(200)
};


/**
 * @function index
 * TODO: Route on which the called this function, now is not used
 */
exports.index = function(req, res) {
  res.send(204);
};

function getKeys(obj, keys) {
  keys = keys || [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys.filter(function(elem, pos, self) {
    return self.indexOf(elem) == pos;
  });
}


function getParsData(array, function_of_building_structures, timezone) {
  array.forEach(function(el){
    if(el.authors.length>0){
      el.authors.forEach(function(el_nest){
        function_of_building_structures(el, el_nest, timezone)
      })
    }else function_of_building_structures(el, {}, timezone)
  })
}

function handlingData(req, res, _query, function_of_building_structures) {
  posterController.findPosters_Function(res, _query).then(function(result){
    getParsData(result, function_of_building_structures, req.query.timezone);
    var header = getKeys(exportArray[0]);
    var delimiter=req.query.delimiter || ',';
    //if(_query.del) del=_query.del;
    json2csv({ data: exportArray, fields: header, del:delimiter }, function(err, csv) {
      if (err) console.log(err);
      var filePath='file.csv';
      fs.writeFile(filePath, csv, function(err) {
        if (err) handleError(res, err);

        res.send(200,{url:filePath});
        //fs.unlinkSync(filePath);

      });
    });
  });
}


function createExportData_Poster(obj, author){
  var _arr = {};

  _arr["Code"] = obj.code;
  _arr["Abstract Title"] = obj.title;
  _arr["Topic"] = '';
  _arr["Subtopic"] = '';
  _arr["Session"] = '';

  _arr["Presenter FirstName"] = '';
  _arr["Presenter LastName"] = '';
  _arr["Presenter Affiliation"] = '';
  _arr["Presenter Email"] = '';

  _arr["Corresponding Author FirstName"] = '';
  _arr["Corresponding Author LastName"] = '';
  _arr["Corresponding Author Affiliation"] = '';
  _arr["Corresponding Author Email"] = '';

  _arr["Author FirstName"] = author.firstName;
  _arr["Author LastName"] = author.lastName;
  _arr["Author Affiliation"] = author.institution;
  _arr["Author Email"] = author.email;

  if(author.isCorresponding){
    _arr["Corresponding Author FirstName"] = author.firstName;
    _arr["Corresponding Author LastName"] = author.lastName;
    _arr["Corresponding Author Affiliation"] = author.institution;
    _arr["Corresponding Author Email"] = author.email;
  }
  if(author.isPresenter){
    _arr["Presenter FirstName"] = author.firstName;
    _arr["Presenter LastName"] = author.lastName;
    _arr["Presenter Affiliation"] = author.institution;
    _arr["Presenter Email"] = author.email;
  }
  exportArray.push(_arr);
}


function createExportData_Schedule(obj, author, timezone){
  var _arr = {};

  var room=obj.room ? obj.room.title+' - '+obj.room.roomName : 'No Room';
  var monitor=obj.room&&obj.room.monitors[obj.monitor].title ? obj.room.monitors[obj.monitor].title:'No Monitor';
  var startDate = fixTimezone(obj.startDate, timezone);

  _arr["Code"] = obj.code;
  _arr["Title"] = obj.title;
  _arr["Presentation Type"] = obj.presentationType;
  _arr["Session"] = room;
  _arr["Monitor"] = monitor;
  _arr["Start Date"] = moment(startDate).format('lll');
  _arr["Duration"] = obj.duration;

  _arr["Author FirstName"] = author.firstName;
  _arr["Author LastName"] = author.lastName;
  _arr["Author Affiliation"] = author.institution;
  _arr["Author Email"] = author.email;

  _arr["Presenter FirstName"] = '';
  _arr["Presenter LastName"] = '';
  _arr["Presenter Affiliation"] = '';
  _arr["Presenter Email"] = '';

  _arr["Corresponding Author FirstName"] = '';
  _arr["Corresponding Author LastName"] = '';
  _arr["Corresponding Author Affiliation"] = '';
  _arr["Corresponding Author Email"] = '';

  if(author.isCorresponding){
    _arr["Corresponding Author FirstName"] = author.firstName;
    _arr["Corresponding Author LastName"] = author.lastName;
    _arr["Corresponding Author Affiliation"] = author.institution;
    _arr["Corresponding Author Email"] = author.email;
  }
  if(author.isPresenter){
    _arr["Presenter FirstName"] = author.firstName;
    _arr["Presenter LastName"] = author.lastName;
    _arr["Presenter Affiliation"] = author.institution;
    _arr["Presenter Email"] = author.email;
  }
  exportArray.push(_arr);
}

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
 * @description function for error handling
 *
 * @function fixTimezone
 *
 * @param {Date} dateTime - Date of appointment Poster in the format UTC.
 * @param {Date} timezone - timezone of the current user
 *
 * @return {Object} - error
 */
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
