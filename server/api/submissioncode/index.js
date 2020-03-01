'use strict';

var express = require('express'),
    controller = require('./submissioncode.controller');
    // auth = require('../../auth/auth.service'),
    // config = require('./../../config/environment');

var router = express.Router();

router.get('/',           controller.index);
router.get('/conference', controller.conference);
router.get('/sendemail',  controller.sendemail);

module.exports = router;
