const express = require('express');
const router = express.Router();

const { newProduct, getProducts, getSingleProduct } = require('../controllers/productController')

// add new products => /api/v1/product/new
router.route('/product/new').post(newProduct);
// Get all products => /api/v1/products
router.route('/products').get(getProducts);
// Get single products => /api/v1/admin/product/:id
router.route('/admin/product/:id').get(getSingleProduct);

module.exports = router;