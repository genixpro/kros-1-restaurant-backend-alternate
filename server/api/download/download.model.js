'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var DownloadSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  identifier: String,
  name: String,
  demo: String,
  wiki: String,
  info: String,
  s3Keys: [{
    isLatest: Boolean,
    version: String,
    key: String,
    updateInstructions: String
  }]
});

DownloadSchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('Download', DownloadSchema);
