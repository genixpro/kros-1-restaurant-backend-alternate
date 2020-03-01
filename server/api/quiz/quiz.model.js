'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var schemaOptions = {
  collection: 'quizzes'
};

var QuizSchema = new Schema({
  // reference the user account of the creator
  createdBy: {
    type: String,
    ref: 'User'
  },
  title: String,
  body: String,
  // reference to lecture
  lecture: {
    type: String,
    ref: 'Lecture'
  },
  questions: [{
    question: String,
    answers: [{
      answer: String,
      isCorrect: {
        type: Boolean,
        default: false
      }
    }]
  }],
  // we use this field to set the prefered order of the quizzes
  weight: {
    type: Number,
    default: 0
  },
  // we use this field when the first time record created
  createdAt: Number,
  // we use this field when the record is updated
  modifiedAt: Number,
  // the selected application regarding this record
  application: {
    type: String,
    ref: 'Application'
  }
}, schemaOptions);

QuizSchema.plugin(mUtilities.pagination);

/**
 * Get the courses by lecture. The current Course schema only hold the lectureId,
 * so we need to fetch the lecture details first before we populate the
 * response
 * @param {String} lectureId lecture dentifier
 * @param {Function} cb callback function
 */
QuizSchema.statics.getByLecture = function(lectureId, cb) {
  this.find({
    lecture: lectureId
  }, null, {
    sort: {
      weight: 1
    }
  }, cb);
};

module.exports = mongoose.model('Quiz', QuizSchema);
