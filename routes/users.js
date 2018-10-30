const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


/* GET users listing. */
router.get('/', userController.index);
router.post('/', userController.create);

module.exports = router;
