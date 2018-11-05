const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


/* GET users listing. */
router.post('/search', userController.search);
router.get('/', userController.index);
router.post('/', userController.create);
router.post('/delete', userController.delete);
router.get('/:id', userController.view);
router.post('/:id', userController.edit);
module.exports = router;
