'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

/**
 * Atricles Schema
 */
var ProductSchema = new Schema({
  // reference the user account of the creator
  createdBy: {
    type: String,
    ref: 'User'
  },
  title: String,
  description: {
    type: String,
    default: ''
  },
  // list of media associated with this document
  media: [{
    type: String,
    ref: 'Media'
  }],
  // reference to category
  category: {
    type: String,
    ref: 'CatalogueCategory'
  },
  price: Number,
  url: String,
  pdfUrl: String,
  featured: Boolean,
  customFields: [
    {
      name: String,
      value: String,
      valueType: String, // 'string' | 'numeric'
      weight: { type: Number, default: 0 }
    }
  ],
  // we use this field the first time a product is created
  createdAt: Number,
  // we use this field when a product is updated
  modifiedAt: Number,
  // the selected application regarding this record
  application: {
    type: String,
    ref: 'Application'
  }
});

ProductSchema.plugin(mUtilities.pagination);

ProductSchema.statics.getByCategory = function(catId, cb) {
  this.find({
    category: catId
  })
  .sort({ weight: 1 })
  .populate('media')
  .exec(cb)
};


module.exports = mongoose.model('Product', ProductSchema);
