const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

//register routes
router.get('/register', authController.register_get);
router.post('/register', authController.register_post);

//login routes
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);

//logout route
router.get('/logout', authController.logout_get);

module.exports = router;