'use strict';

var express = require('express');
var controller = require('./posters-lint.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/sessions/empty', auth.isAuthenticated(), controller.getEmpty);
router.get('/sessions/overflown', auth.isAuthenticated(), controller.getOverflown);
router.get('/posters/non-assigned', auth.isAuthenticated(), controller.getNonAssigned);
router.get('/summary', auth.isAuthenticated(), controller.summaryData);

module.exports = router;
