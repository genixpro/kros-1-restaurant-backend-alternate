'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  name: String,
  description: String,
  type: {type: String, enum: ['restaurant', 'conference', 'lectures', 'local-business', 'catalogue']},

  createdBy: {
    type: String,
    ref: 'User'
  },
  createdAt: Number,
  modifiedAt: Number,

  owners: [{
    type: String,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Application', ApplicationSchema);
