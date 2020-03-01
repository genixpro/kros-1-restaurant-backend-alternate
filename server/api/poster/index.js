'use strict';

var express = require('express');
var controller = require('./poster.controller');
var groupController = require('./poster.group.controller');
var auth = require('../../auth/auth.service');
var router = express.Router();

router.get('/', auth.isAuthenticated(true), controller.index);
router.get('/:id', auth.isAuthenticated(true), controller.show);
router.post('/', auth.isAuthenticated(), controller.create);
router.post('/:id', auth.isAuthenticated(), controller.update);
router.post('/batch-actions/clear-assigments', auth.isAuthenticated(), controller.clearAssignments);
router.patch('/:id', auth.isAuthenticated(), controller.update);
router.delete('/', auth.isAuthenticated(), controller.destroyAll);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
router.put('/', auth.isAuthenticated(), controller.update);

router.get('/summary/presentation-types', auth.isAuthenticated(true), controller.getPresentationTypes);

router.get('/group/authors', auth.isAuthenticated(), groupController.getGroupedByAuthorEmail);
router.get('/group/institutions', auth.isAuthenticated(), groupController.getGroupedByAuthorInstitution);

module.exports = router;
