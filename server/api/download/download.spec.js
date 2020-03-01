'use strict';

var should = require('should'),
  app = require('../../app'),
  request = require('supertest'),
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  mongoose = require('mongoose'),
  MongoClient = require('mongodb').MongoClient;

var token = '',
  userId = '',
  downloadId1 = mongoose.Types.ObjectId(),
  downloadId2 = mongoose.Types.ObjectId();

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/downloads', function() {
  before(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        userId = user._id.toString();


        // setup the dummy downloads
         var dummyDownloads = [{
          _id: downloadId1,
          createdBy: userId,
          identifier: '300664323',
          name: 'Corporate+ - Pro',
          demo: '',
          wiki: '',
          info: '',
          s3Keys: [{
            isLatest: true,
            version: '2.1.0',
            key: "corporateplus-pro_2.1.0.zip",
            updateInstructions: ''
          }, {
            version: '2.0.1',
            key: "corporateplus/corporateplus-pro_2.0.1.zip",
            updateInstructions: ''
          }]
        }, {
          _id: downloadId2,
          createdBy: userId,
          identifier: '300664444',
          name: 'New 2',
          demo: '',
          wiki: '',
          info: '',
          s3Keys: [{
            isLatest: true,
            version: '2.1.0',
            key: "corporateplus-pro_2.1.0.zip",
            updateInstructions: ''
          }, {
            version: '2.0.1',
            key: "corporateplus/corporateplus-pro_2.0.1.zip",
            updateInstructions: ''
          }]
        }];

        // Connect to the db
        MongoClient.connect(config.mongo.uri, function(err, db) {
          if (err) {
            return console.dir(err);
          }

          // Get the documents collection
          var downCol = db.collection('downloads');

          // Insert some documents
          downCol.insert(dummyDownloads, done);
        });
      });
    });
  });

  after(function(done) {
    MongoClient.connect(config.mongo.uri, function(err, db) {
      if (err) {
        return console.dir(err);
      }

      var downCol = db.collection('downloads');
      downCol.remove(done);
    });
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

  describe('GET /api/downloads', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/downloads')
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');
          // assert the document structure
          body.result[0].should.have.property('createdBy');
          body.result[0].should.have.property('_id');
          body.result[0].should.have.property('name');
          body.result[0].should.have.property('weight');

          body.result.should.be.instanceof(Array);

          done();
        });
    });
  });


  describe('GET /api/downloads/:id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/downloads/' + downloadId1)
        .set('Authorization', getBearer())
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');


          // assert the document structure
          body.result.should.have.property('createdBy');
          body.result.should.have.property('_id');
          body.result.should.have.property('name');
          body.result.should.have.property('weight');

          done();
        });
    });
  });
});
