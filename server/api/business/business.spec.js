'use strict';

var should = require('should'),
    app = require('../../app'),
    request = require('supertest'),
    User = require('./../../api/user/user.model'),
    config = require('./../../config/environment'),
    MongoClient = require('mongodb').MongoClient;

var TEST_USER_NAME      = 'Test User',
    TEST_USER_EMAIL     = 'test@test.com',
    TEST_USER_PASSWORD  = 'test'

var token     = '',
    createdBy = '',
    docId     = '',
    userId    = '';

/**
* A helper function to build the Authorization header string
*/
function getBearer() {
  return 'Bearer ' + token;
}

function dummyDocument(userID){
  var placeholder = {
    createdBy: userID,
    business: {
      name: '',
      description: '',
      hours: '',
      website: '',
      email: '',
      address: '',
      addressExtra: '',
      zipcode: '',
      latlong: '',
      zoom: ''
    },
    invoice: {
      name: '',
      organisationId: '',
      phone: '',
      email: '',
      address: '',
      addressExtra: '',
      zipcode: '',
      state: '',
    },
    contact: {
      name: '',
      phone: '',
      email: ''
    },
    offers: {
      active: true
    },
    media: [],
    createdAt: Date.now(),
    modifiedAt: Date.now()
  };

  return placeholder;
}

function prepare(done){
  User.find({}).remove(function() {
    User.create({
      provider: 'local',
      name:     TEST_USER_NAME,
      email:    TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD
    }, function(err, user) {
      userId = user._id.toString();
      // setup the dummy prefs
      var dummy = dummyDocument(user._id.toString());

      // Connect to the db
      MongoClient.connect(config.mongo.uri, function(err, db) {
        if (err) {
          return console.dir(err);
        }

        // Get the documents collection
        var collection = db.collection('businesses');
        // Insert some documents
        collection.insert(dummy, function(err, result) {
          docId = result[0]._id.toString();
          done();
        });
      });
    });
  });
}

function cleanup(done){
  MongoClient.connect(config.mongo.uri, function(err, db) {
    if (err) {
      return console.dir(err);
    }

    var collection = db.collection('businesses');

    collection.remove(done);
  });
}

describe.only('/api/businesses', function() {

  before(function(done){
    prepare(done)
  });

  after(function(done){
    cleanup(done);
  })

  describe.only('Login', function() {

    it('should receive a JSON Web token', function(done) {
      request(app)
      .post('/auth/local')
      .set('Content-Type', 'application/json')
      .send({
        "email":    TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD
      })
      .expect('Content-Type', /json/)
      .expect(function(res) {
        token = res.body.token;
      })
      .expect(200, done);
    });
  });


  describe('GET /api/businesses', function() {

    it('should respond with JSON array', function(done) {
      request(app)
      .get('/api/businesses')
      .set('Authorization', getBearer())
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        var body = res.body;

        body.should.have.property('result');

        // assert the document structure
        body.result[0].should.have.property('_id');
        body.result[0].should.have.property('createdBy');
        body.result[0].should.have.property('business');
        body.result[0].should.have.property('invoice');
        body.result[0].should.have.property('contact');
        body.result[0].should.have.property('offers');

        body.result[0].should.have.property('createdAt');
        body.result[0].should.have.property('modifiedAt');

        res.body.result.should.be.instanceof(Array);
        done();
      });
    });

  });

  describe('GET /api/businesses/:id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
      .get('/api/businesses/' + docId)
      .set('Authorization', getBearer())
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);

        var body = res.body;

        body.should.have.property('result');

        // assert the document structure
        body.result.should.have.property('_id');
        body.result.should.have.property('createdBy');
        body.result.should.have.property('business');
        body.result.should.have.property('invoice');
        body.result.should.have.property('contact');
        body.result.should.have.property('offers');

        body.result.should.have.property('createdAt');
        body.result.should.have.property('modifiedAt');

        done();
      });
    });
  });

  describe('GET /api/businesses/search/:user_id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
      .get('/api/businesses/search/' + userId)
      .set('Authorization', getBearer())
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);

        var body = res.body;

        body.should.have.property('result');

        // assert the document structure
        body.result[0].should.have.property('_id');
        body.result[0].should.have.property('createdBy');
        body.result[0].should.have.property('business');
        body.result[0].should.have.property('invoice');
        body.result[0].should.have.property('contact');
        body.result[0].should.have.property('offers');

        body.result[0].should.have.property('createdAt');
        body.result[0].should.have.property('modifiedAt');

        done();
      });
    });
  });



  describe('GET /api/businesses/public/:appType/:owner', function() {

    it('should respond with JSON array', function(done) {
      request(app)
      .get('/api/businesses/public/restaurant/' + userId)
      .set('Authorization', getBearer())
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);

        var body = res.body;

        console.log('Get Public Businesse: ', body);

        // body.should.have.property('result');

        // assert the document structure
        // body.result[0].should.have.property('_id');
        // body.result[0].should.have.property('createdBy');
        // body.result[0].should.have.property('business');
        // body.result[0].should.have.property('invoice');
        // body.result[0].should.have.property('contact');
        // body.result[0].should.have.property('offers');
        //
        // body.result[0].should.have.property('createdAt');
        // body.result[0].should.have.property('modifiedAt');

        done();
      });
    });
  });


});
