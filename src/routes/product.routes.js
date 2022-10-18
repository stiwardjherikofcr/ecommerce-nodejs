const express = require('express');
const router = express.Router();

const productController = require('../controllers/product.controller');
const { isAuthenticated } = require('../helpers/auth');

router
    .get('/products_list', productController.listProducts)
    .get('/add_cart/:id', productController.addToCart)
    .get('/cart', productController.cart)

module.exports = router;
