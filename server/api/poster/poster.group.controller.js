'use strict';
/**
 * @description executed when the transition of route 'api/group'
 */

/**
 * third-party files and modules
 */
var _ = require('lodash');
var Poster = require('./poster.model');
//var GroupedPosters = require('./groupedPosters.model');

/**
 * @description function for mapReduce
 */
var _mapFunctionByAuthorEmail = mapFunctionByAuthorEmail;
var _mapFunctionByAuthorInstitution = mapFunctionByAuthorInstitution;

var _reduceFunctionByAuthorEmail = reduceFunctionByAuthorEmail;
var _reduceFunctionByAuthorInstitution = reduceFunctionByAuthorInstitution;


/**
 * @description called when in to the server comes a request: get('api/posters/group/authors')
 *              Get a grouped by author email posters
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -error or found poster
 */
exports.getGroupedByAuthorEmail = function(req, res) {
  var o = {};
  o.map = _mapFunctionByAuthorEmail;
  o.reduce = _reduceFunctionByAuthorEmail;
//  o.out = { replace: 'temp' };
  o.query = {
    createdBy: req.headers.app_id,
    authors: { $elemMatch: { email: {$ne:''}} }
  };
//  o.finalize = _finalizeFunction;
//  o.verbose = true;

  Poster.mapReduce(o,function(err, result){
        if(!err){
          res.json(200,{result: _.pluck(result, 'value')})
        }else{
          return res.send(500);
        }
      }
  );
};

/**
 * @description called when in to the server comes a request: get('api/posters/group/institution')
 *              Get a grouped by author institution posters
 *
 * @param {Object} req - is an object containing information about the HTTP request that raised the event.
 * @param {Object} res - in response to req, you use res to send back the desired HTTP response.
 *
 * @return {Object} -error or found poster
 */
exports.getGroupedByAuthorInstitution = function(req, res) {
  var o = {};
  o.map = _mapFunctionByAuthorInstitution;
  o.reduce = _reduceFunctionByAuthorInstitution;
//  o.out = { replace: 'temp' };
  o.query = {
    createdBy: req.headers.app_id,
    authors: { $elemMatch: { institution: {$ne:''}} }
  };
//  o.finalize = _finalizeFunction;
//  o.verbose = true;

  Poster.mapReduce(o,function(err, result){
        if(!err){
          res.json(200,{result: _.pluck(result, 'value')})
        }else{
          return res.send(500);
        }
      }
  );
};


function mapFunctionByAuthorEmail(){
  var self = this;
  this.authors.forEach(function(author){
    if(author.email){
      var key = author.email
      var value = {
        firstName: author.firstName,
        lastName: author.lastName,
        institution:author.institution,
        email: author.email,
        isPresenter: author.isPresenter||false,
        isCorresponder: author.isCorresponder||false,
        posters: [self]
      };
      emit(key, value);
    }
  })
};

function mapFunctionByAuthorInstitution(){
  var self = this;
  this.authors.forEach(function(author){
    if(author.institution){
      var key = author.institution
      var value = {
        institution:author.institution,
        posters: [self]
      };
      emit(key, value);
    }
  })
};

function reduceFunctionByAuthorEmail(keySKU, countObjVals) {
  var reducedVal = {
    firstName: countObjVals[0].firstName,
    lastName: countObjVals[0].lastName,
    institution: countObjVals[0].institution,
    email: countObjVals[0].email,
    isPresenter: countObjVals[0].isPresenter,
    isCorresponder: countObjVals[0].isCorresponder,
    posters: [] };

  countObjVals.forEach(function(val){
    reducedVal.posters.push(val.posters[0]);
  })
  return reducedVal;
};

function reduceFunctionByAuthorInstitution(keySKU, countObjVals) {
  var reducedVal = {
    institution: countObjVals[0].institution,
    posters: [] };

  countObjVals.forEach(function(val){
    reducedVal.posters.push(val.posters[0]);
  })
  return reducedVal;
};
