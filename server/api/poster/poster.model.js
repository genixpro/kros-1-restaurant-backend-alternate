'use strict';

var mongoose = require('mongoose'),
    mUtilities = require('mongoose-utilities'),
    Schema = mongoose.Schema;

var schemaOptions = {
          collection: 'posters'
};


var PosterSchema = new Schema({
    // reference the user account of the creator
    createdBy: {
      type: String,
      ref: 'User'
    },
    title: String,
    presentationType: String,
    code: String,
    resourceKey: {type: String, default: '01b0005'},
    startDate: Number,  //DateTime information in milliseconds
    duration: Number,   //In minutes
    room: { type: Schema.Types.ObjectId, ref: 'Room' },
    monitor: {
      type: Number,     // (?) We need a reference to a particular monitor of the room this poster is assigned to.
      default: -1
    },
    // we use this field when the first time record created
    createdAt: Number,
    // we use this field when the record is updated
    modifiedAt: Number,
    isCanceled:Boolean,
    authors: [
      {
        firstName: String,
        lastName: String,
        email: String,
        institution: String,
        isCorresponding: Boolean,
        isPresenter: Boolean,
      }
    ]
}, schemaOptions);

PosterSchema.plugin(mUtilities.pagination);
module.exports = mongoose.model('Poster', PosterSchema);
