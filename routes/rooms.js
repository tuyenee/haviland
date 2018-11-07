const acl = require('../config/acl');

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

/* Rooms CRUD. */
router.post('/search', roomController.search);
router.get('/', roomController.index);
router.post('/', acl.requireRole('admin') , roomController.create);
router.post('/delete', acl.requireRole('admin'), roomController.delete);
router.get('/:id', roomController.view);
router.post('/:id', acl.requireRole('admin'), roomController.edit);

module.exports = router;
