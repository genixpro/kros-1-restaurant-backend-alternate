'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var token;

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('/api/restaurant-orders', function() {
  before(function(done) {
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

  describe('GET /api/restaurant-orders', function() {
    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/restaurant-orders')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.result.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('POST /api/restaurant-orders', function() {
    it('should return HTTP 401 if no access token provided', function(done) {
      request(app)
        .post('/api/restaurant-orders')
        .expect(401)
        .end(done);
    });

    it('should return 200 if access token is provided', function(done) {
      request(app)
        .post('/api/restaurant-orders')
        .set('Authorization', getBearer())
        .send({
          hello: 'world'
        })
        .expect(201)
        .end(done);
    });
  });
  
  
  describe('GET /api/restaurant-orders/orderCreatedNotify', function() {
  
    it('should return 200 if email was sended', function(done) {
      request(app)
        .get('/api/restaurant-orders/orderCreatedNotify')
        .set('Authorization', getBearer())
        .query({
          'friendlyID': '230',
          'email': 'test@test.com'
        })
        .expect(200)
        .end(done);
    });
  });
  
});
