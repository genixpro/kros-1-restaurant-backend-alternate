'use strict';

var should = require('should'),
  async = require('async'),
  app = require('../../app'),
  request = require('supertest'),
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  mongoose = require('mongoose'),
  MongoClient = require('mongodb').MongoClient;

var token = '',
  userId = '',
  dummyMediaId = mongoose.Types.ObjectId(),
  dummyCourseId = mongoose.Types.ObjectId(),
  dummyGradeId = mongoose.Types.ObjectId(),
  firstCategoryId = mongoose.Types.ObjectId(),
  secondCategoryId = mongoose.Types.ObjectId();

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
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

describe('/api/topics', function() {
  before(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        userId = user._id.toString();

        // setup dummy media
        var dummyMedias = [{
          _id: dummyMediaId,
          createdBy: userId,
          uri: 'http://example.org',
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        var dummyGrades = [{
          _id: dummyGradeId,
          createdBy: userId,
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
          createdBy: userId,
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
          _id: firstCategoryId,
          // on Category Schema definition, we set the `createdBy` as a String,
          // so we need to make sure it stored as a hex String
          createdBy: userId,
          name: 'Foods',
          weight: 1,
          media: [
            dummyMediaId
          ],
          course: dummyCourseId.toString(),
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }, {
          _id: secondCategoryId,
          createdBy: userId,
          name: 'Snacks',
          weight: 1,
          media: [
            dummyMediaId
          ],
          course: dummyCourseId.toString(),
          createdAt: Date.now(),
          modifiedAt: Date.now()
        }];

        async.series([
          function(cb) {
            insertDocs({
              collectionName: 'topics',
              documents: dummyTopics
            }, cb)
          },
          function(cb) {
            insertDocs({
              collectionName: 'courses',
              documents: dummyCourses
            }, cb)
          },
          function(cb) {
            insertDocs({
              collectionName: 'grades',
              documents: dummyGrades
            }, cb)
          },
          function(cb) {
            insertDocs({
              collectionName: 'media',
              documents: dummyMedias
            }, cb)
          }
        ], done);
      });
    });
  });

  after(function(done) {
    async.series([function(cb) {
        removeDocs('topics', cb);
      },
      function(cb) {
        removeDocs('media', cb);
      }
    ], done)
  });

  describe('Login', function() {

    it('should receive a JSON Web token', function(done) {
      request(app)
        .post('/auth/local')
        .set('Content-Type', 'application/json')
        .send({
          'email': 'test@test.com',
          'password': 'test'
        })
        .expect('Content-Type', /json/)
        .expect(function(res) {
          token = res.body.token;
        })
        .expect(200, done);
    });
  });

  describe('GET /api/topics', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/topics')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          // assert the media item properties
          body.result[0].should.have.property('media');
          body.result[0].media[0].should.have.property('createdBy');
          body.result[0].media[0].should.have.property('uri');
          body.result[0].media[0].should.have.property('createdAt');
          body.result[0].media[0].should.have.property('modifiedAt');

          // assert the document structure
          body.result[0].should.have.property('createdBy');
          body.result[0].should.have.property('name');
          body.result[0].should.have.property('createdAt');
          body.result[0].should.have.property('modifiedAt');
          body.result[0].should.have.property('_id');
          body.result[0].should.have.property('weight');
          body.result[0].should.have.property('media');
          body.result[0].should.have.property('course');

          body.result.should.be.instanceof(Array);

          done();
        });
    });
  });

  describe('GET /api/topics/:id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/topics/' + firstCategoryId)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');

          // assert the media item properties
          body.result.should.have.property('media');
          body.result.media[0].should.have.property('createdBy');
          body.result.media[0].should.have.property('uri');
          body.result.media[0].should.have.property('createdAt');
          body.result.media[0].should.have.property('modifiedAt');

          // assert the document structure
          body.result.should.have.property('createdBy');
          body.result.should.have.property('name');
          body.result.should.have.property('createdAt');
          body.result.should.have.property('modifiedAt');
          body.result.should.have.property('_id');
          body.result.should.have.property('weight');
          body.result.should.have.property('media');
          body.result.should.have.property('course');

          done();
        });
    });
  });
});
