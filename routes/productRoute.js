const express = require('express');
const router = express.Router();

const { newProduct } = require('../controllers/productController')

// add new products => /api/v1/product/new
router.route('/product/new').post(newProduct);

module.exports = router;