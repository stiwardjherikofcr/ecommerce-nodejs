const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { isAuthenticated, isNotAuthenticated } = require('../helpers/auth');
const uploadFile = require('../middleware/upload');

router
    .get('/signup', isNotAuthenticated, authController.signupForm)
    .post('/signup', isNotAuthenticated, uploadFile.single('image'), authController.signup)
    .get('/signin', isNotAuthenticated, authController.signinForm)
    .post('/signin', isNotAuthenticated, authController.signin)
    .get('/logout', isAuthenticated, authController.logout)

module.exports = router;