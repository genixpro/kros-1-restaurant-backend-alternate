/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var autoIncrement = require('mongoose-auto-increment');

// Connect to database
var connection =  mongoose.connect(config.mongo.uri, config.mongo.options);
autoIncrement.initialize(connection);

// Populate DB with sample data
if (config.seedDB) {
  var seed = require('./config/seed');
  config.publicAppId = seed.app_id;
}

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, function() {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
