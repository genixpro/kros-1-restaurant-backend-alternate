'use strict';

var express = require('express');
var controller = require('./db.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.put('/', auth.hasRole('admin'), controller.update);

module.exports = router;
