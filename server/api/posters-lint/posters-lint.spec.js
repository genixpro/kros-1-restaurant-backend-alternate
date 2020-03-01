'use strict';

var should = require('should'),
  mongoose = require('mongoose'),
  Promise = require('bluebird'),
  request = require('supertest'),
  app = require('../../app'),
  User = require('./../../api/user/user.model'),
  config = require('./../../config/environment'),
  MongoClient = require('mongodb').MongoClient,
  token = '',
  userId = '',
  appId = '55f1bad689a95da732a531f0';

function getBearer() {
  return 'Bearer ' + token;
}

function insertDocs(data) {
  return new Promise(function (resolve, reject) {
    // Connect to the db
    MongoClient.connect(config.mongo.uri, function (err, db) {
      if (err) {
        return reject(err);
      }

      var collection = db.collection(data.collectionName);

      // Insert some documents
      collection.insert(data.documents, function (err, result) {
        if (err) {
          return reject(err);
        }

        db.close();

        return resolve(result);
      });
    });
  });
}

function removeDocs(collectionName) {
  return new Promise(function (resolve, reject) {
    // Connect to the db
    MongoClient.connect(config.mongo.uri, function (err, db) {
      if (err) {
        return reject(err);
      }

      var collection = db.collection(collectionName);

      collection.remove(function (err, result) {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    });
  });
}

describe('/api/posters-lint', function () {
  beforeEach(function (done) {
    User.find({}).remove(function () {
      User.create({
        provider: 'local',
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      }, function (err, user) {
        // setup the dummy documents
        userId = user._id.toString();

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
  });

  describe('3 posters, 3 non posters non assigned', function () {
    before(function (done) {
      var dummyRooms = [{
        '_id': mongoose.Types.ObjectId('55f1ca1ea5a1ad604b1b93c5'),
        'startDate': 1444755600000,
        'title': 'PD - Day 3: Tuesday 10:00 - 11:30',
        'category': 'Poster Discussion',
        'roomName': 'Room 2',
        'body': 'Building A - 2st floor',
        'createdBy': appId,
        'createdAt': 1430419502000,
        'modifiedAt': 1430419902000,
        'presentationDuration': 10,
        'fillState': [],
        'availability': [{
          'startDate': 1444755600000,
          'endDate': 1444761000000,
          '_id': mongoose.Types.ObjectId('55f1ca1fa5a1ad604b1b9544')
        }],
        'monitors': [{
          'title': 'Monitor 1',
          'body': '',
          '_id': mongoose.Types.ObjectId('55f1ca1fa5a1ad604b1b9543')
        }],
        '__v': 0
      }];

      // 3 posters, 3 non posters non assigned
      var dummyPosters = [{
        '_id': mongoose.Types.ObjectId('55f1bad789a95da732a53251'),
        'title': 'Quantitative Urine Toxicology Can Help in Improving Compliance and Opioid Dose Adjustment in Chronic Pain Patients',
        'presentationType': 'MCC',
        'code': 'MCC-01',
        'startDate': 1444575600000,
        'duration': 10,
        'createdBy': appId,
        'createdAt': 1424165760000,
        'modifiedAt': 1441907899375,
        'authors': [],
        'monitor': -1,
        'resourceKey': '01b0005',
        '__v': 0,
        'room': null
      }, {
        '_id': mongoose.Types.ObjectId('55f1bad789a95da732a53254'),
        'title': 'Outcome of Percutaneous Lumbar Synovial Cyst Rupture in Patients with Lumbar Radiculopathy: A Case Series',
        'presentationType': 'MCC',
        'code': 'MCC-02',
        'startDate': 1444576200000,
        'duration': 10,
        'createdBy': appId,
        'createdAt': 1423063760000,
        'modifiedAt': 1441907840660,
        'authors': [],
        'monitor': -1,
        'resourceKey': '01b0005',
        '__v': 0,
        'room': null
      }, {
        '_id': mongoose.Types.ObjectId('55f1bad789a95da732a53255'),
        'title': 'Prolonged Relief of Chronic Extreme PTSD and Depression Symptoms in Veterans Following a Stellate Ganglion Block',
        'presentationType': 'MCC',
        'code': 'MCC-03',
        'startDate': null,
        'duration': 0,
        'createdBy': appId,
        'createdAt': 1423063660000,
        'modifiedAt': 1441907526873,
        'authors': [],
        'monitor': -1,
        'resourceKey': '01b0005',
        '__v': 0,
        'room': null
      }];

      insertDocs({
          collectionName: 'rooms',
          documents: dummyRooms
        })
        .then(function () {
          return insertDocs({
            collectionName: 'posters',
            documents: dummyPosters
          });
        })
        .then(function (posters) {
          done();
        })
        .catch(function (err) {
          done();
        });
    })

    after(function (done) {
      var collections = ['rooms', 'posters'];
      var removeRequest = [];
      for (var i = 0; i < collections.length; i++) {
        removeRequest.push(removeDocs(collections[i]));
      }

      Promise
        .all(removeRequest)
        .then(function () {
          done();
        })
        .catch(function () {
          done();
        });
    });

    it('should contained 3 posters is non assigned', function (done) {
      request(app)
        .get('/api/posters-lint/summary')
        .set('Authorization', getBearer())
        .set('app_id', appId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.result.PostersNonAssigned.should.be.equal(3);

          done();
        });
    });
  });

  describe('3 posters, 1 poster was assigned, 2 non posters non assigned', function () {
    before(function (done) {
      var dummyRooms = [{
        '_id': mongoose.Types.ObjectId('55f1ca1ea5a1ad604b1b93c5'),
        'startDate': 1444755600000,
        'title': 'PD - Day 3: Tuesday 10:00 - 11:30',
        'category': 'Poster Discussion',
        'roomName': 'Room 2',
        'body': 'Building A - 2st floor',
        'createdBy': '55f1ca1ea5a1ad604b1b93ab',
        'createdAt': 1430419502000,
        'modifiedAt': 1430419902000,
        'presentationDuration': 10,
        'fillState': [],
        'availability': [{
          'startDate': 1444755600000,
          'endDate': 1444761000000,
          '_id': mongoose.Types.ObjectId('55f1ca1fa5a1ad604b1b9544')
        }],
        'monitors': [{
          'title': 'Monitor 1',
          'body': '',
          '_id': mongoose.Types.ObjectId('55f1ca1fa5a1ad604b1b9543')
        }],
        '__v': 0
      }];

      // 3 posters, 1 poster was assigned, 2 non posters non assigned
      var dummyPosters = [{
        '_id': mongoose.Types.ObjectId('55f1bad789a95da732a53251'),
        'title': 'Quantitative Urine Toxicology Can Help in Improving Compliance and Opioid Dose Adjustment in Chronic Pain Patients',
        'presentationType': 'MCC',
        'code': 'MCC-01',
        'startDate': 1444575600000,
        'duration': 10,
        'createdBy': appId,
        'createdAt': 1424165760000,
        'modifiedAt': 1441907899375,
        'authors': [],
        'monitor': 1,
        'resourceKey': '01b0005',
        '__v': 0,
        'room': '55f1ca1ea5a1ad604b1b93c5'
      }, {
        '_id': mongoose.Types.ObjectId('55f1bad789a95da732a53254'),
        'title': 'Outcome of Percutaneous Lumbar Synovial Cyst Rupture in Patients with Lumbar Radiculopathy: A Case Series',
        'presentationType': 'MCC',
        'code': 'MCC-02',
        'startDate': 1444576200000,
        'duration': 10,
        'createdBy': appId,
        'createdAt': 1423063760000,
        'modifiedAt': 1441907840660,
        'authors': [],
        'monitor': -1,
        'resourceKey': '01b0005',
        '__v': 0,
        'room': null
      }, {
        '_id': mongoose.Types.ObjectId('55f1bad789a95da732a53255'),
        'title': 'Prolonged Relief of Chronic Extreme PTSD and Depression Symptoms in Veterans Following a Stellate Ganglion Block',
        'presentationType': 'MCC',
        'code': 'MCC-03',
        'startDate': null,
        'duration': 0,
        'createdBy': appId,
        'createdAt': 1423063660000,
        'modifiedAt': 1441907526873,
        'authors': [],
        'monitor': -1,
        'resourceKey': '01b0005',
        '__v': 0,
        'room': null
      }];

      insertDocs({
          collectionName: 'rooms',
          documents: dummyRooms
        })
        .then(function () {
          return insertDocs({
            collectionName: 'posters',
            documents: dummyPosters
          });
        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done();
        });
    })

    after(function (done) {
      var collections = ['rooms', 'posters'];
      var removeRequest = [];
      for (var i = 0; i < collections.length; i++) {
        removeRequest.push(removeDocs(collections[i]));
      }

      Promise
        .all(removeRequest)
        .then(function () {
          done();
        })
        .catch(function () {
          done();
        });
    });

    it('should contained 2 posters is non assigned', function (done) {
      request(app)
        .get('/api/posters-lint/summary')
        .set('Authorization', getBearer())
        .set('app_id', appId)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.result.PostersNonAssigned.should.be.equal(2);

          done();
        });
    });
  });
});
