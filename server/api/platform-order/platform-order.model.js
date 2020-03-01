'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var PlatformOrderSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  purchaseId: String,
  runningNo: String,
  purchaseDate: {
    date: Date
  },
  productId: String,
  quantity: {type: Number, default: 1 },
  name: String,
  email: String,
  additionalEmails: [String],
  company: String,
  street: String,
  country: String,
  city: String,
  zip: String,
  notes: String
});

PlatformOrderSchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('PlatformOrder', PlatformOrderSchema);
