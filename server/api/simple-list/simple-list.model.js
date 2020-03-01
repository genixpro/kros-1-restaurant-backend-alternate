'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var SimpleListSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  creatorId: String,
  name: String,
  body: String,
  createdAt: Number,
  modifiedAt: Number,
  application: {
    type: String,
    ref: 'Application'
  }
});

SimpleListSchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('SimpleList', SimpleListSchema);
