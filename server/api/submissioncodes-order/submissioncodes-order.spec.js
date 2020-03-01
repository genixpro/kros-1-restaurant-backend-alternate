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
  submissioncodesOrderId1 = mongoose.Types.ObjectId();

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/submissioncodes-order', function() {
  before(function(done) {
    User.find({}).remove(function() {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function(err, user) {
        userId = user._id.toString();


        // setup the dummy platform orders
        var dummySubmissioncodesOrders = [{
          _id: submissioncodesOrderId1,
          createdBy: userId,
          purchaseId: "FS472774745",
          runningNo: "FS123490",
          purchaseDate: {
            date: new Date()
          },
          productId: "X300615008",
          quantity: 1,
          name: "Evangelos Karageorgos",
          email: "vangelis.karageorgos@gmail.com",
          additionalEmails: [
            "foo@bar.com",
            "baz@bar.com"
          ],
          company: "ABC Co",
          street: "Mikras Asias 26",
          country: "Greece",
          city: "Xanthi",
          zip: "67100ccc",
          notes: "Foo bar, baz ..."
        }]
        // Connect to the db
        MongoClient.connect(config.mongo.uri, function(err, db) {
          if (err) {
            return console.dir(err);
          }

          // Get the documents collection
          var platfCol = db.collection('submissioncodesorders');


          // Insert some documents
          platfCol.insert(dummySubmissioncodesOrders, done);
        });
      });
    });
  });

  after(function(done) {
    MongoClient.connect(config.mongo.uri, function(err, db) {
      if (err) {
        return console.dir(err);
      }

      var platfCol = db.collection('SubmissioncodesOrders');
      platfCol.remove(done);
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

  describe('GET /api/submissioncodes-order', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/submissioncodes-order')
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
          body.result[0].should.have.property('purchaseId');
          body.result[0].should.have.property('purchaseDate');
          body.result[0].should.have.property('productId');
          body.result[0].should.have.property('quantity');
          body.result[0].should.have.property('email');

          body.result.should.be.instanceof(Array);

          done();
        });
    });
  });


  describe('GET /api/submissioncodes-order/:id', function() {

    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/submissioncodes-order/' + submissioncodesOrderId1)
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
          body.result.should.have.property('purchaseId');
          body.result.should.have.property('purchaseDate');
          body.result.should.have.property('productId');
          body.result.should.have.property('quantity');
          body.result.should.have.property('email');

          done();
        });
    });
  });


  describe('POST /api/submissioncodes-order/fastspring', function() {
    it('should respond with JSON object', function(done) {
      var data = {
        reference: 'reference',
        subscriptionReference: 'subscriptionReference',
        internalProductName: 'internalProductName',
        quantity: '13',
        referrer: 'referrer',
        company: 'test company',
        email: 'test@test.com',
        name: 'test name'
      }

      request(app)
        .post('/api/submissioncodes-order/fastspring')
        .send(data)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');


          // assert the document structure
          body.result.should.have.property('_id');
          body.result.should.have.property('purchaseId');
          body.result.should.have.property('purchaseDate');
          body.result.should.have.property('productId');
          body.result.should.have.property('quantity');
          body.result.should.have.property('email');

          done();
        });
    });
  });

  describe('POST /api/submissioncodes-order/shareit', function() {
    it('should respond with JSON object', function(done) {
      var data = {
        reference: 'reference',
        subscriptionReference: 'subscriptionReference',
        internalProductName: 'internalProductName',
        quantity: '13',
        referrer: 'referrer',
        company: 'test company',
        email: 'test@test.com',
        name: 'test name'
      }

      request(app)
        .post('/api/submissioncodes-order/shareit')
        .send(data)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);

          var body = res.body;

          body.should.have.property('result');


          // assert the document structure
          body.result.should.have.property('_id');
          body.result.should.have.property('purchaseId');
          body.result.should.have.property('purchaseDate');
          body.result.should.have.property('productId');
          body.result.should.have.property('quantity');
          body.result.should.have.property('email');

          done();
        });
    });
  });


});
