const express = require('express');
const router = express.Router();

const orderController = require('../controllers/order.controller');
const { isAuthenticated, authorizedRole } = require('../helpers/auth');

router
    .get('/', isAuthenticated, orderController.getOrders)
    .get('/:id', isAuthenticated, orderController.getOrder)
    .post('/new', isAuthenticated, orderController.createOrder)

    .get('/admin', isAuthenticated, orderController.getOrdersAdmin)
    .get('/admin/:id', isAuthenticated, authorizedRole(2), orderController.getOrderAdmin)
    .put('/admin/:id', isAuthenticated, authorizedRole(2), orderController.updateOrderAdmin)
    .delete('/admin/:id', isAuthenticated, authorizedRole(2), orderController.deleteOrderAdmin);

module.exports = router;