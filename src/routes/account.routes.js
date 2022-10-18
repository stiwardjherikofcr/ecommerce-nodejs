const express = require('express');
const router = express.Router();

const accountController = require('../controllers/account.controller');
const { isAuthenticated } = require('../helpers/auth');

router.get('/profile', isAuthenticated, accountController.profile);

module.exports = router;