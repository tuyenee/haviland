const acl = require('../config/acl');

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const csrf = require('csurf');

/* CSRF Protection */
const csrfProtection = csrf();

/* Rooms CRUD. */
if(process.env.CSRF_FIXED) {
    router.get('/search', csrfProtection, roomController.search);
    router.get('/:id', csrfProtection, roomController.view);
    router.get('/', csrfProtection, roomController.index);
    router.post('/reserve/', csrfProtection, roomController.reserve);
    router.post('/process-reservation/', csrfProtection, roomController.processReservation);
    router.post('/release', csrfProtection, acl.requireRole('admin'), roomController.release);
    router.post('/', csrfProtection, acl.requireRole('admin') , roomController.create);
    router.post('/delete', csrfProtection, acl.requireRole('admin'), roomController.delete);
    router.post('/:id', csrfProtection, acl.requireRole('admin'), roomController.edit);
} else {
    router.get('/search', roomController.search);
    router.get('/:id', roomController.view);
    router.get('/', roomController.index);
    router.post('/reserve/', roomController.reserve);
    router.post('/process-reservation/', roomController.processReservation);
    router.post('/release', acl.requireRole('admin'), roomController.release);
    router.post('/', acl.requireRole('admin') , roomController.create);
    router.post('/delete', acl.requireRole('admin'), roomController.delete);
    router.post('/:id', acl.requireRole('admin'), roomController.edit);
}

module.exports = router;
