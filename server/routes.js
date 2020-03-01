/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/applications', require('./api/application'));
  app.use('/api/posters', require('./api/poster'));
  app.use('/api/lectures', require('./api/lecture'));
  app.use('/api/quizzes', require('./api/quiz'));
  app.use('/api/reviews', require('./api/review'));
  app.use('/api/accounts', require('./api/account'));
  app.use('/api/pages', require('./api/page'));
  app.use('/api/restaurant-orders', require('./api/restaurant-order'));
  app.use('/api/offers', require('./api/offer'));
  app.use('/api/items', require('./api/item'));
  app.use('/api/categories', require('./api/category'));
  app.use('/api/catalogue-categories', require('./api/catalogue-category'));
  app.use('/api/downloads', require('./api/download'));
  app.use('/api/grades', require('./api/grade'));
  app.use('/api/courses', require('./api/course'));
  app.use('/api/topics', require('./api/topic'));
  app.use('/api/articles', require('./api/article'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/uploads', require('./api/upload'));
  app.use('/api/media', require('./api/media'));
  app.use('/api/rooms', require('./api/room'));
  app.use('/api/db', require('./api/db'));
  app.use('/api/clients', require('./api/client'));
  app.use('/api/posters-export', require('./api/posters-export'));
  app.use('/api/posters-lint', require('./api/posters-lint'));
  app.use('/api/platform-orders', require('./api/platform-order'));
  app.use('/api/businesses', require('./api/business'));
  app.use('/api/products', require('./api/product'));
  app.use('/api/simple-lists', require('./api/simple-list'));
  app.use('/api/s3downloads', require('./api/s3-download'));
  // TODO: API code/endpoint is missing
  // app.use('/api/reports', require('./api/reports'));
  app.use('/api/submissioncode', require('./api/submissioncode'));
  app.use('/api/submissioncodes-order', require('./api/submissioncodes-order'));

  // Public API
  app.use('/public/business', require('./api/account'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
