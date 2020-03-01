'use strict';

var express = require('express'),
  controller = require('./quiz.controller'),
  auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/public/:createdBy',       controller.public.index);
router.get('/public/lecture/:lecture', controller.public.indexByLecture);

router.get('/',             auth.isAuthenticated(), auth.canAccessApp(), controller.index);
router.get('/lecture/:id',  auth.isAuthenticated(),                      controller.indexByLecture);
router.get('/:id',          auth.isAuthenticated(),                      controller.show);
router.post('/',            auth.isAuthenticated(), auth.canAccessApp(), controller.create);
router.put('/:id',          auth.isAuthenticated(), auth.canAccessApp(), controller.update);
router.patch('/:id',        auth.isAuthenticated(), auth.canAccessApp(), controller.update);
router.delete('/:id',       auth.isAuthenticated(),                      controller.destroy);

module.exports = router;
