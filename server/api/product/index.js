'use strict';

var express = require('express'),
  controller = require('./product.controller'),
  auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/',             auth.isAuthenticated(), auth.canAccessApp(), controller.index);
router.get('/category/:id', auth.isAuthenticated(), auth.canAccessApp(), controller.indexByCategory);
router.get('/:id',          auth.isAuthenticated(),                      controller.show);
router.post('/',             auth.isAuthenticated(), auth.canAccessApp(), controller.create);
router.get('/custom-field/name', auth.isAuthenticated(), auth.canAccessApp(), controller.customFieldNameIndex);
router.put('/:id',          auth.isAuthenticated(), auth.canAccessApp(), controller.update);
router.patch('/:id',        auth.isAuthenticated(), auth.canAccessApp(), controller.update);
router.delete('/:id',       auth.isAuthenticated(),                      controller.destroy);

module.exports = router;
