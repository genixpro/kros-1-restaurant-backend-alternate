'use strict';

var _ = require('lodash');
var Quiz = require('./quiz.model');


var pub = {
  index: function(req, res) {

    // Mogoose sort
    // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
    Quiz.find({
        createdBy: req.params.createdBy
      })
      .sort({
        weight: 1,
        createdAt: 1
      })
      .populate({
        path: 'createdBy',
        select: '-hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .populate('lecture')
      .exec(function(err, quizzes) {
        if (err) {
          return handleError(res, err);
        }

        return res.json(200, {
          result: quizzes
        });
      });
  },

  indexByLecture: function(req, res) {

    Quiz.find({
        lecture: req.params.lecture
      })
      .sort({
        weight: 1,
        createdAt: 1
      })
      .populate({
        path: 'createdBy',
        select: '-hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .populate('lecture')
      .exec(function(err, quizzes) {
        if (err) {
          return handleError(res, err);
        }

        return res.json(200, {
          result: quizzes
        });
      });
  }
};

// Get list of topics
exports.public = pub;

// Get list of lectures
exports.index = function(req, res) {
  Quiz.paginate({
    query: {
      //createdBy: req.user._id
      application: req.app
    },
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 5,
    sort: {
      weight: 1,
      createdAt: 1
    }
  }, function(err, provider) {
    if (err) {
      return handleError(res, err);
    }

    res.json(200, {
      page: provider.page,
      page_size: 5,
      total: provider.docs.length,
      num_pages: provider.pages,
      result: provider.docs
    });
  });
};

// Get list of records by lecture
exports.indexByLecture = function(req, res) {
  Quiz.getByLecture(req.params.id, function(err, docs) {
    return res.json(200, {
      result: docs
    });
  });
};

// Get a single quiz
exports.show = function(req, res) {
  Quiz
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('lecture')
    .exec(function(err, doc) {
      if (err) {
        return handleError(res, err);
      }
      if (!doc) {
        return res.send(404);
      }

      return res.json(200, {
        result: doc
      });
    });
};

// Creates a new quiz
exports.create = function(req, res) {
  if (req.body) {
    var data = {
      createdBy: req.user._id,
      title: req.body.title,
      body: req.body.body,
      questions: req.body.questions,
      lecture: req.body.lectureId,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      application: req.app
    };

    Quiz.create(data, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        result: doc
      });
    });

  }
};

// Updates an existing quiz in the DB.
exports.update = function(req, res) {
  if (req.body && req.params.id) {
    var data = {
      createdBy: req.user._id.toString(),
      title: req.body.title,
      body: req.body.body,
      questions: req.body.questions,
      lecture: req.body.lectureId,
      weight: req.body.weight,
      modifiedAt: Date.now(),
      application: req.app
    };

    Quiz.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        handleError(res, err);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/quizzes/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a quiz from the DB.
exports.destroy = function(req, res) {
  Quiz.findById(req.params.id, function(err, quiz) {
    if (err) {
      return handleError(res, err);
    }
    if (!quiz) {
      return res.send(404);
    }
    quiz.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
