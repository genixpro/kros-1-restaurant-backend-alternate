'use strict';

var express = require('express'),
    controller = require('./business.contoller'),
    auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/public/:applicationType',                  controller.public.index);
router.get('/public/:applicationType/:owner',                  controller.public.searchByTypeOwner);

router.get('/',                 auth.isAuthenticated(), auth.canAccessApp(), controller.index);

router.get('/:id',              auth.isAuthenticated(), controller.show);
router.get('/search/:user_id',  auth.isAuthenticated(), controller.find);
router.post('/',                auth.canAccessApp(),    controller.create);
router.put('/:id',              auth.isAuthenticated(), controller.update);
router.patch('/:id',                                    controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
