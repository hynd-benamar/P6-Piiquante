const express = require('express');
const userCtrl = require('../controllers/user');
const passwordMiddleware = require('../middleware/password');
const router = express.Router();

//si un user crer un compte la req va d'abord être controller par le middleware passwordCtrl 
router.post('/signup', passwordMiddleware, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;