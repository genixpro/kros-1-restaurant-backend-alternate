'use strict';

var mongoose = require('mongoose'),
    mUtilities = require('mongoose-utilities'),
    Schema = mongoose.Schema;

var schemaOptions = {
      collection: 'rooms'
};

var RoomSchema = new Schema({
  // reference the user account of the creator
  createdBy: {
    type: String,
    ref: 'User'
  },
  title: String,
  category: String,
  roomName: String,
  body: String,
  startDate: Number,
  monitors: [{
         title: String,
         body: String,
  }],
  presentationDuration: Number,
  availability: [{
           startDate: Number,
           endDate: Number,
    }],
  // we use this field when the first time record created
  createdAt: Number,
  // we use this field when the record is updated
  modifiedAt: Number,
  fillState: [String]
}, schemaOptions);

RoomSchema.pre('save', function (next) {
  // do stuff
  var array = this.availability;
  var index = 0;

  if (typeof array[index] !== 'undefined' && array[index] !== null) {
    this.startDate = array[index].startDate;
  }

  console.log("Rooms:: Pre save ....:");
  console.log("     availability[0] :" + array[0]);
  console.log("     this.startDate .:" + this.startDate);

  next();
});


RoomSchema.pre('update', function (next) {
  // do stuff
  var array = this.availability;
  var index = 0;

  if (typeof array[index] !== 'undefined' && array[index] !== null) {
    this.startDate = array[index].startDate;
  }

  console.log("Rooms:: Pre update ....:");
  console.log("     availability[0] :" + array[0]);
  console.log("     this.startDate .:" + this.startDate);

  next();
});

RoomSchema.plugin(mUtilities.pagination);
module.exports = mongoose.model('Room', RoomSchema);
