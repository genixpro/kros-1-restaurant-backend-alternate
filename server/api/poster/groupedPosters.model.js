'use strict';

/**
 * TODO: delete the file if it does not further to be used
 * @description not used with 11.09.15
 */
var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var schemaOptions = {
  collection: 'temp'
};


var GroupedPostersSchema = new Schema({
  value:{}
}, schemaOptions);

module.exports = mongoose.model('GroupedPosters', GroupedPostersSchema);
