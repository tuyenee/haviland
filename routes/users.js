const acl = require('../config/acl');

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/* Users CRUD. */
router.post('/search', userController.search);
router.get('/', acl.requireRole('admin'), userController.index);
router.post('/', userController.create);
router.post('/delete', userController.delete);
router.get('/:id', acl.requireRole('admin', (req) => req.params.id), userController.view);
router.post('/:id', userController.edit);

module.exports = router;
