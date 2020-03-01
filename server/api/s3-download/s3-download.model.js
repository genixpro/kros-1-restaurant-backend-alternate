var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;


var S3DownloadSchema = new Schema({
  productId: {type: String, required: true},
  name: {type: String, required: true},
  demo: String,
  wiki: String,
  info: String,
  s3_keys: [
    {
      isLatest: Boolean,
      version: String,
      key: String,
      updateInstructions: String
    }
  ]

});

S3DownloadSchema.plugin(mUtilities.pagination);
module.exports = mongoose.model('S3Download', S3DownloadSchema);
