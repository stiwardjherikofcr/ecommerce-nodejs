const express = require('express');
const router = express.Router();

const ivaController = require('../controllers/iva.controller');
const { isAuthenticated, authorizedRole } = require('../helpers/auth');

router
    .get('/', ivaController.getIva)
    .put('/', isAuthenticated, authorizedRole(2), ivaController.updateIva);

module.exports = router;