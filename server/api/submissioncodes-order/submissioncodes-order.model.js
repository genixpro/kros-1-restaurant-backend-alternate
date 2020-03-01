'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var SubmissioncodesOrderSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  purchaseId: String,
  runningNo: String,
  // purchaseDate: String,
  purchaseDate: Date,
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
  notes: String,
  abstractId: String,
  submissionCode: String,
  //Fastspring
  referrer: String,
  sourceKey: String,
  sourceCampaign: String,
  test: {type: Boolean, default: false}
});

SubmissioncodesOrderSchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('SubmissioncodesOrder', SubmissioncodesOrderSchema);
