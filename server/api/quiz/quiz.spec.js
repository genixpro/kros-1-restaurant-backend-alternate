'use strict';

var should = require('should'),
  mongoose = require('mongoose'),
  request = require('supertest'),
  async = require('async'),
  MongoClient = require('mongodb').MongoClient,
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  app = require('../../app');

var token = '',
  userId = mongoose.Types.ObjectId(),
  dummyMediaId = mongoose.Types.ObjectId(),
  dummyCourseId = mongoose.Types.ObjectId(),
  dummyGradeId = mongoose.Types.ObjectId(),
  dummyTopicId = mongoose.Types.ObjectId(),
  dummyLectureId = mongoose.Types.ObjectId(),
  dummyQuizId = mongoose.Types.ObjectId();

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

function removeDocs(collectionName, cb) {
  // Connect to the db
  MongoClient.connect(config.mongo.uri, function(err, db) {
    if (err) {
      cb(err);
    }

    var collection = db.collection(collectionName);

    collection.remove(function(err, result) {
      if (err) {
        cb(err);
      }

      cb(null, result);
    });
  });
}

function insertDocs(data, cb) {
  // Connect to the db
  MongoClient.connect(config.mongo.uri, function(err, db) {
    if (err) {
      cb(err);
    }

    var collection = db.collection(data.collectionName);

    // Insert some documents
    collection.insert(data.documents, function(err, result) {
      if (err) {
        cb(err);
      }

      db.close();

      cb(null, result);
    });
  });
}

function removeDocs(collectionName, cb) {
  // Connect to the db
  MongoClient.connect(config.mongo.uri, function(err, db) {
    if (err) {
      cb(err);
    }

    var collection = db.collection(collectionName);

    collection.remove(function(err, result) {
      if (err) {
        cb(err);
      }

      cb(null, result);
    });
  });
}

describe('/api/quizzes', function() {
  before(function(done) {
    var dummyUsers = [{
      _id: userId,
      provider: 'local',
      name: 'Test User1',
      email: 'test1@test.com',
      hashedPassword: 'IfwIzXmNpctDFHMuGTb+V2fbmgRl24Y2eXEkqBZc5EMJ7p/fCF2FKLOVG0eDys17z6vegQbHPM0G2acDoGiJOg==',
      salt: 'BHVro6CQVNubA/xZ17Gt7Q==',
      expiration: 1430390165420,
      featured: false,
      role: 'user',
      __v: 0
    }];

    insertDocs({
      collectionName: 'users',
      documents: dummyUsers
    }, done);
  });

  after(function(done) {
    removeDocs('users', done);
  });

  describe('Login', function() {
    it('should receive a JSON Web token', function(done) {
      request(app)
        .post('/auth/local')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test1@test.com',
          password: 'test1'
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          token = res.body.token;
        })
        .expect(200, done);
    });
  });

  describe('GET /api/quizzes', function() {
    before(function(done) {
      // setup dummy media
      var dummyMedias = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyGrades = [{
        _id: dummyGradeId,
        createdBy: userId.toString(),
        name: 'Grade A',
        createdAt: 1427088141250,
        modifiedAt: 1427088141250,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      var dummyCourses = [{
        _id: dummyCourseId,
        createdBy: userId.toString(),
        grade: dummyGradeId.toString(),
        name: 'Course A',
        createdAt: 1427088147911,
        modifiedAt: 1427088147912,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      // setup the dummy topics
      var dummyTopics = [{
        _id: dummyTopicId,
        // on Category Schema definition, we set the `createdBy` as a String,
        // so we need to make sure it stored as a hex String
        createdBy: userId.toString(),
        name: 'Foods',
        weight: 1,
        media: [
          dummyMediaId
        ],
        course: dummyCourseId.toString(),
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyLectures = [{
        _id: dummyLectureId,
        createdBy: userId.toString(),
        title: 'Cooking Lecture',
        body: 'Lecture about cooking',
        youtubeLink: 'http://example.org',
        media: [
          dummyMediaId.toString()
        ]
      }];

      var dummyMedia = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyQuizzes = [{
        _id: dummyQuizId,
        createdBy: userId.toString(),
        title: 'Any questions',
        body: 'Any questions that will surprise you',
        lecture: dummyLectureId.toString(),
        questions: [{
          question: 'How many fingers do we have?',
          answers: [{
            answer: 5,
            isCorrect: false
          }, {
            answer: 10,
            isCorrect: true
          }, {
            answer: 2,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }, {
          question: 'How many eyes do we have?',
          answers: [{
            answer: 2,
            isCorrect: true
          }, {
            answer: 10,
            isCorrect: false
          }, {
            answer: 5,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }]
      }];

      async.series([
        function(cb) {
          insertDocs({
            collectionName: 'media',
            documents: dummyMedias
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'grades',
            documents: dummyGrades
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'courses',
            documents: dummyCourses
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'topics',
            documents: dummyTopics
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'lectures',
            documents: dummyLectures
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'quizzes',
            documents: dummyQuizzes
          }, cb);
        }
      ], done);
    });

    after(function(done) {
      async.series([
        function(cb) {
          removeDocs('media', cb);
        },
        function(cb) {
          removeDocs('grades', cb);
        },
        function(cb) {
          removeDocs('courses', cb);
        },
        function(cb) {
          removeDocs('topics', cb);
        },
        function(cb) {
          removeDocs('lectures', cb);
        },
        function(cb) {
          removeDocs('quizzes', cb);
        }
      ], done);
    });

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/quizzes')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('page');
          body.should.have.property('page_size');
          body.should.have.property('total');
          body.should.have.property('num_pages');
          body.should.have.property('result');

          body.result.should.be.instanceof(Array);

          done();
        });
    });
  });

  describe('GET /api/quizzes/:id', function() {
    before(function(done) {
      // setup dummy media
      var dummyMedias = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyGrades = [{
        _id: dummyGradeId,
        createdBy: userId.toString(),
        name: 'Grade A',
        createdAt: 1427088141250,
        modifiedAt: 1427088141250,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      var dummyCourses = [{
        _id: dummyCourseId,
        createdBy: userId.toString(),
        grade: dummyGradeId.toString(),
        name: 'Course A',
        createdAt: 1427088147911,
        modifiedAt: 1427088147912,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      // setup the dummy topics
      var dummyTopics = [{
        _id: dummyTopicId,
        // on Category Schema definition, we set the `createdBy` as a String,
        // so we need to make sure it stored as a hex String
        createdBy: userId.toString(),
        name: 'Foods',
        weight: 1,
        media: [
          dummyMediaId
        ],
        course: dummyCourseId.toString(),
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyLectures = [{
        _id: dummyLectureId,
        createdBy: userId.toString(),
        title: 'Cooking Lecture',
        body: 'Lecture about cooking',
        youtubeLink: 'http://example.org',
        media: [
          dummyMediaId.toString()
        ]
      }];

      var dummyMedia = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyQuizzes = [{
        _id: dummyQuizId,
        createdBy: userId.toString(),
        title: 'Any questions',
        body: 'Any questions that will surprise you',
        lecture: dummyLectureId.toString(),
        questions: [{
          question: 'How many fingers do we have?',
          answers: [{
            answer: 5,
            isCorrect: false
          }, {
            answer: 10,
            isCorrect: true
          }, {
            answer: 2,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }, {
          question: 'How many eyes do we have?',
          answers: [{
            answer: 2,
            isCorrect: true
          }, {
            answer: 10,
            isCorrect: false
          }, {
            answer: 5,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }]
      }];

      async.series([
        function(cb) {
          insertDocs({
            collectionName: 'media',
            documents: dummyMedias
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'grades',
            documents: dummyGrades
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'courses',
            documents: dummyCourses
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'topics',
            documents: dummyTopics
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'lectures',
            documents: dummyLectures
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'quizzes',
            documents: dummyQuizzes
          }, cb);
        }
      ], done);
    });

    after(function(done) {
      async.series([
        function(cb) {
          removeDocs('media', cb);
        },
        function(cb) {
          removeDocs('grades', cb);
        },
        function(cb) {
          removeDocs('courses', cb);
        },
        function(cb) {
          removeDocs('topics', cb);
        },
        function(cb) {
          removeDocs('lectures', cb);
        },
        function(cb) {
          removeDocs('quizzes', cb);
        }
      ], done);
    });

    it('should respond with JSON object', function(done) {
      request(app)
        .get('/api/quizzes/' + dummyQuizId.toString())
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          // assert the properties
          body.result.should.have.property('title');
          body.result.should.have.property('body');
          body.result.should.have.property('questions');

          body.result.should.have.property('createdBy');
          // assert the createdBy properties
          body.result.createdBy.should.have.property('name');
          body.result.createdBy.should.have.property('email');
          body.result.createdBy.should.have.property('_id');
          body.result.createdBy.should.have.property('role');

          done();
        });
    });
  });

  describe('POST /api/quizzes', function() {
    before(function(done) {
      // setup dummy media
      var dummyMedias = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyGrades = [{
        _id: dummyGradeId,
        createdBy: userId.toString(),
        name: 'Grade A',
        createdAt: 1427088141250,
        modifiedAt: 1427088141250,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      var dummyCourses = [{
        _id: dummyCourseId,
        createdBy: userId.toString(),
        grade: dummyGradeId.toString(),
        name: 'Course A',
        createdAt: 1427088147911,
        modifiedAt: 1427088147912,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      // setup the dummy topics
      var dummyTopics = [{
        _id: dummyTopicId,
        // on Category Schema definition, we set the `createdBy` as a String,
        // so we need to make sure it stored as a hex String
        createdBy: userId.toString(),
        name: 'Foods',
        weight: 1,
        media: [
          dummyMediaId
        ],
        course: dummyCourseId.toString(),
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyLectures = [{
        _id: dummyLectureId,
        createdBy: userId.toString(),
        title: 'Cooking Lecture',
        body: 'Lecture about cooking',
        youtubeLink: 'http://example.org',
        media: [
          dummyMediaId.toString()
        ]
      }];

      var dummyMedia = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyQuizzes = [{
        _id: dummyQuizId,
        createdBy: userId.toString(),
        title: 'Any questions',
        body: 'Any questions that will surprise you',
        lecture: dummyLectureId.toString(),
        questions: [{
          question: 'How many fingers do we have?',
          answers: [{
            answer: 5,
            isCorrect: false
          }, {
            answer: 10,
            isCorrect: true
          }, {
            answer: 2,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }, {
          question: 'How many eyes do we have?',
          answers: [{
            answer: 2,
            isCorrect: true
          }, {
            answer: 10,
            isCorrect: false
          }, {
            answer: 5,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }]
      }];

      async.series([
        function(cb) {
          insertDocs({
            collectionName: 'media',
            documents: dummyMedias
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'grades',
            documents: dummyGrades
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'courses',
            documents: dummyCourses
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'topics',
            documents: dummyTopics
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'lectures',
            documents: dummyLectures
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'quizzes',
            documents: dummyQuizzes
          }, cb);
        }
      ], done);
    });

    after(function(done) {
      async.series([
        function(cb) {
          removeDocs('media', cb);
        },
        function(cb) {
          removeDocs('grades', cb);
        },
        function(cb) {
          removeDocs('courses', cb);
        },
        function(cb) {
          removeDocs('topics', cb);
        },
        function(cb) {
          removeDocs('lectures', cb);
        },
        function(cb) {
          removeDocs('quizzes', cb);
        }
      ], done);
    });

    it('should return the added lectures', function(done) {
      request(app)
        .post('/api/quizzes')
        .set('Authorization', getBearer())
        .send({
          _id: dummyQuizId.toString(),
          createdBy: userId.toString(),
          title: 'Any questions',
          body: 'Any questions that will surprise you',
          lectureId: dummyLectureId.toString(),
          questions: [{
            question: 'How many fingers do we have?',
            answers: [{
              answer: 5,
              isCorrect: false
            }, {
              answer: 10,
              isCorrect: true
            }, {
              answer: 2,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }, {
            question: 'How many eyes do we have?',
            answers: [{
              answer: 2,
              isCorrect: true
            }, {
              answer: 10,
              isCorrect: false
            }, {
              answer: 5,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }]
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          var body = res.body;

          // assert the returned response properties
          body.result.should.have.property('title');
          body.result.should.have.property('body');
          body.result.should.have.property('questions');
          body.result.should.have.property('createdBy');
        })
        .expect(201, done);
    });
  });

  describe('PUT /api/quizzes/:id', function() {
    before(function(done) {
      // setup dummy media
      var dummyMedias = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyGrades = [{
        _id: dummyGradeId,
        createdBy: userId.toString(),
        name: 'Grade A',
        createdAt: 1427088141250,
        modifiedAt: 1427088141250,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      var dummyCourses = [{
        _id: dummyCourseId,
        createdBy: userId.toString(),
        grade: dummyGradeId.toString(),
        name: 'Course A',
        createdAt: 1427088147911,
        modifiedAt: 1427088147912,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      // setup the dummy topics
      var dummyTopics = [{
        _id: dummyTopicId,
        // on Category Schema definition, we set the `createdBy` as a String,
        // so we need to make sure it stored as a hex String
        createdBy: userId.toString(),
        name: 'Foods',
        weight: 1,
        media: [
          dummyMediaId
        ],
        course: dummyCourseId.toString(),
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyLectures = [{
        _id: dummyLectureId,
        createdBy: userId.toString(),
        title: 'Cooking Lecture',
        body: 'Lecture about cooking',
        youtubeLink: 'http://example.org',
        media: [
          dummyMediaId.toString()
        ]
      }];

      var dummyMedia = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyQuizzes = [{
        _id: dummyQuizId,
        createdBy: userId.toString(),
        title: 'Any questions',
        body: 'Any questions that will surprise you',
        lecture: dummyLectureId.toString(),
        questions: [{
          question: 'How many fingers do we have?',
          answers: [{
            answer: 5,
            isCorrect: false
          }, {
            answer: 10,
            isCorrect: true
          }, {
            answer: 2,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }, {
          question: 'How many eyes do we have?',
          answers: [{
            answer: 2,
            isCorrect: true
          }, {
            answer: 10,
            isCorrect: false
          }, {
            answer: 5,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }]
      }];

      async.series([
        function(cb) {
          insertDocs({
            collectionName: 'media',
            documents: dummyMedias
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'grades',
            documents: dummyGrades
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'courses',
            documents: dummyCourses
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'topics',
            documents: dummyTopics
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'lectures',
            documents: dummyLectures
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'quizzes',
            documents: dummyQuizzes
          }, cb);
        }
      ], done);
    });

    after(function(done) {
      async.series([
        function(cb) {
          removeDocs('media', cb);
        },
        function(cb) {
          removeDocs('grades', cb);
        },
        function(cb) {
          removeDocs('courses', cb);
        },
        function(cb) {
          removeDocs('topics', cb);
        },
        function(cb) {
          removeDocs('lectures', cb);
        },
        function(cb) {
          removeDocs('quizzes', cb);
        }
      ], done);
    });

    it('should return the updated lectures', function(done) {
      request(app)
        .put('/api/quizzes/' + dummyQuizId.toString())
        .set('Authorization', getBearer())
        .send({
          _id: dummyQuizId.toString(),
          createdBy: userId.toString(),
          title: 'Any questions',
          body: 'Any questions that will surprise you',
          weight: 0,
          lectureId: dummyLectureId.toString(),
          questions: [{
            question: 'How many hairs do we have?',
            answers: [{
              answer: 3,
              isCorrect: false
            }, {
              answer: 'thousands',
              isCorrect: true
            }, {
              answer: 2,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }, {
            question: 'How many eyes do we have?',
            answers: [{
              answer: 2,
              isCorrect: true
            }, {
              answer: 10,
              isCorrect: false
            }, {
              answer: 5,
              isCorrect: false
            }, {
              answer: 4,
              isCorrect: false
            }]
          }]
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          var body = res.body;

          // assert the returned response properties
          body.result.should.have.property('title');
          body.result.should.have.property('body');
          body.result.should.have.property('questions');
          body.result.should.have.property('createdBy');
        })
        .expect(200, done);
    });
  });

  describe('DELETE /api/quizzes/:id', function() {
    before(function(done) {
      // setup dummy media
      var dummyMedias = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyGrades = [{
        _id: dummyGradeId,
        createdBy: userId.toString(),
        name: 'Grade A',
        createdAt: 1427088141250,
        modifiedAt: 1427088141250,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      var dummyCourses = [{
        _id: dummyCourseId,
        createdBy: userId.toString(),
        grade: dummyGradeId.toString(),
        name: 'Course A',
        createdAt: 1427088147911,
        modifiedAt: 1427088147912,
        weight: 0,
        media: [
          dummyMediaId
        ]
      }];

      // setup the dummy topics
      var dummyTopics = [{
        _id: dummyTopicId,
        // on Category Schema definition, we set the `createdBy` as a String,
        // so we need to make sure it stored as a hex String
        createdBy: userId.toString(),
        name: 'Foods',
        weight: 1,
        media: [
          dummyMediaId
        ],
        course: dummyCourseId.toString(),
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyLectures = [{
        _id: dummyLectureId,
        createdBy: userId.toString(),
        title: 'Cooking Lecture',
        body: 'Lecture about cooking',
        youtubeLink: 'http://example.org',
        media: [
          dummyMediaId.toString()
        ]
      }];

      var dummyMedia = [{
        _id: dummyMediaId,
        createdBy: userId.toString(),
        uri: 'http://example.org',
        createdAt: Date.now(),
        modifiedAt: Date.now()
      }];

      var dummyQuizzes = [{
        _id: dummyQuizId,
        createdBy: userId.toString(),
        title: 'Any questions',
        body: 'Any questions that will surprise you',
        lecture: dummyLectureId.toString(),
        questions: [{
          question: 'How many fingers do we have?',
          answers: [{
            answer: 5,
            isCorrect: false
          }, {
            answer: 10,
            isCorrect: true
          }, {
            answer: 2,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }, {
          question: 'How many eyes do we have?',
          answers: [{
            answer: 2,
            isCorrect: true
          }, {
            answer: 10,
            isCorrect: false
          }, {
            answer: 5,
            isCorrect: false
          }, {
            answer: 4,
            isCorrect: false
          }]
        }]
      }];

      async.series([
        function(cb) {
          insertDocs({
            collectionName: 'media',
            documents: dummyMedias
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'grades',
            documents: dummyGrades
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'courses',
            documents: dummyCourses
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'topics',
            documents: dummyTopics
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'lectures',
            documents: dummyLectures
          }, cb);
        },
        function(cb) {
          insertDocs({
            collectionName: 'quizzes',
            documents: dummyQuizzes
          }, cb);
        }
      ], done);
    });

    after(function(done) {
      async.series([
        function(cb) {
          removeDocs('media', cb);
        },
        function(cb) {
          removeDocs('grades', cb);
        },
        function(cb) {
          removeDocs('courses', cb);
        },
        function(cb) {
          removeDocs('topics', cb);
        },
        function(cb) {
          removeDocs('lectures', cb);
        },
        function(cb) {
          removeDocs('quizzes', cb);
        }
      ], done);
    });

    it('should delete single record', function(done) {
      request(app)
        .del('/api/quizzes/' + dummyQuizId.toString())
        .set('Authorization', getBearer())
        .expect(204, done);
    });
  });

  describe('get non-exist document', function() {
    it('should return HTTP 404 Not Found', function(done) {
      request(app)
        .get('/api/quizzes/' + mongoose.Types.ObjectId().toString())
        .set('Authorization', getBearer())
        .expect(404, done);
    });
  });
});
