'use strict';

var express = require('express');
var controller = require('./posters-export.controller.js');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.isAuthenticated(), controller.index);
router.get('/schedule', auth.isAuthenticated(), controller.exportSchedule);
router.get('/posters', auth.isAuthenticated(), controller.exportPosters);
router.delete('/', auth.isAuthenticated(), controller.delete);

module.exports = router;
