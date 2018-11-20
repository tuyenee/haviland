const acl = require('../config/acl');

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const csrf = require('csurf');

/* CSRF Protection */
const csrfProtection = csrf();

/* Users CRUD. */
router.post('/search', userController.search);
router.get('/', acl.requireRole('admin'), csrfProtection, userController.index);

if(process.env.CSRF_FIXED) {
    router.post('/', csrfProtection, userController.create);
    router.post('/delete', csrfProtection, userController.delete);
    router.get('/:id', csrfProtection, acl.requireRole('admin', (req) => req.params.id), userController.view);
    router.post('/:id', csrfProtection, userController.edit);
} else {
    router.post('/', userController.create);
    router.post('/delete', userController.delete);
    router.get('/:id', acl.requireRole('admin', (req) => req.params.id), userController.view);
    router.post('/:id', userController.edit);
}


module.exports = router;
