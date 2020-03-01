'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var CatalogueCategorySchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  creatorId: String,
  name: String,
  media: [{
    type: String,
    ref: 'Media'
  }],
  weight: {
    type: Number,
    default: 0
  },
  featured: Boolean,
  createdAt: Number,
  modifiedAt: Number,
  parentCategory: {
    type: String,
    ref: 'CatalogueCategory'
  },
  application: {
    type: String,
    ref: 'Application'
  },
  description: String
});

CatalogueCategorySchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('CatalogueCategory', CatalogueCategorySchema);
