'use strict';

var app = require('../../app'),
  request = require('supertest'),
  mongoose = require('mongoose'),
  expect = require('expect.js'),
  config = require('./../../config/environment'),
  User = require('./../../api/user/user.model'),
  token = '',
  userId = '';

var dummyApps;

var Application = require('./../../api/application/application.model');

var toBeDelete,
  token;

/**
 * A helper function to build the Authorization header string
 */
function getBearer() {
  return 'Bearer ' + token;
}

describe('Submissioncode', function() {

  before(function (done) {

    createUser(function(err, user){
      userId = user._id.toString();
      createApps(function(){
        console.log('finished populating applications');

        request(app)
          .post('/auth/local')
          .set('Content-Type', 'application/json')
          .send({
            'email': 'test@test.com',
            'password': 'test'
          })
          .expect('Content-Type', /json/)
          .expect(function (res) {
            token = res.body.token;
          })
          .expect(200, done);
      });
    });

  }); // before

  describe('GET /api/submissioncode', function(){

    it('should return a list of articles', function(done) {
      request(app)
        .get('/api/submissioncode')
        .set('Authorization', getBearer())
        .expect('Content-Type', /json/)
        .expect(function(res) {

          var body = res.body;
          console.log('/api/submissioncode called. returned: ', body);
          expect(body).to.have.key('result');
          expect(body.result).to.be(true);
        })
        .expect(200, done);
    }); // it

  }); // describe


  describe('GET /api/submissioncode/fetchcodes', function(){

    it('should return a list of sumbission codes', function(done) {
      request(app)
        .get('/api/submissioncode/fetchcodes')
        .set('Authorization', getBearer())
        .expect('Content-Type', /json/)
        .expect(function(res) {

          var body = res.body;
          console.log('/api/submissioncode/fetchcodes called. returned: ', body);
          expect(body).to.have.key('result');
          expect(body.result).to.be.an('array');
        })
        .expect(200, done);
    }); // it

  }); // describe

  describe('GET /api/submissioncode/sendemail', function(){

    it('should return a list of sumbission codes', function(done) {
      request(app)
        .get('/api/submissioncode/sendemail')
        .set('Authorization', getBearer())
        .expect('Content-Type', /json/)
        .expect(function(res) {

          var body = res.body;
          console.log('/api/submissioncode/sendemail called. returned: ', body);
          expect(body).to.have.key('result');
          expect(body.result).to.be(true);
        })
        .expect(200, done);
    }); // it

  }); // describe

});



/**
 * A helper function to create a new user
 */
var createUser = function(callback){
  User.find({}).remove(function () {
    User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, callback);
  });
}

/**
 * A helper function to create some application entries
 */
var createApps = function(callback){
  console.log('Populating applications');
  var appId1 = mongoose.Types.ObjectId(); //Reports ITI2015
  var appId2 = mongoose.Types.ObjectId(); //Reports ITI2016
  var appId3 = mongoose.Types.ObjectId(); //Reports ITI2016
  var appId4 = mongoose.Types.ObjectId(); //Reports GHSRIND20016

  Application.find({}).remove(function() {
    dummyApps = [{
      _id: appId1,
      name: 'Reports ITI2015',
      description: 'Abstracts submission reports.',
      type: 'reports',
      createdBy: userId,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      owners: [userId]
    }, {
      _id: appId2,
      name: 'Reports ITI2016',
      description: 'Abstracts submission reports.',
      type: 'reports',
      createdBy: userId,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      owners: [userId]
    }, {
      _id: appId3,
      name: 'Reports ITI2017',
      description: 'Abstracts submission reports.',
      type: 'reports',
      createdBy: userId,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      owners: [userId]
    }, {
      _id: appId4,
      name: 'Reports GSHRIND2016',
      description: 'Abstracts submission reports.',
      type: 'reports',
      createdBy: userId,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      owners: [userId]
    }];
    // Application.create(dummyApps, function() {
    //   console.log('finished populating applications');
    // });
    Application.create(dummyApps, callback);

  });
}
