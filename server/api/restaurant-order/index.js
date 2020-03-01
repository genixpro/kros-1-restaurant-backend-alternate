'use strict';

var express = require('express'),
  controller = require('./restaurant-order.controller'),
  auth = require('../../auth/auth.service');

var router = express.Router();

router.post('/public',                   controller.public.create);

router.get('/', auth.isAuthenticated(), auth.canAccessApp(), controller.index);
router.get('/interval', auth.isAuthenticated(), auth.canAccessApp(), controller.getInterval);
router.get('/summary', auth.isAuthenticated(), controller.summary);
router.get('/orderCreatedNotify', auth.isAuthenticated(), controller.orderCreatedNotify);
router.get('/orderChangeStatusNotify', auth.isAuthenticated(), controller.orderChangeStatusNotify);
router.get('/:id', controller.show);
router.get('/:id', controller.show);
router.post('/', auth.isAuthenticated(), auth.canAccessApp(), controller.create);
router.put('/:id', auth.isAuthenticated(), auth.canAccessApp(), controller.update);
router.patch('/:id', auth.isAuthenticated(), auth.canAccessApp(), controller.update);
router.delete('/:id', controller.destroy);



module.exports = router;
