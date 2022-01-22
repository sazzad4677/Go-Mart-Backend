const express = require('express');
const router = express.Router();

const { newProduct, getProducts, getSingleProduct, updateSingleProduct, deleteSingleProduct, deleteMultiProduct } = require('../controllers/productController')

// add new products => /api/v1/product/new
router.route('/product/new').post(newProduct);
// Get all products => /api/v1/products
router.route('/products').get(getProducts);
// Get single products => /api/v1/admin/product/:id
router.route('/admin/product/:id').get(getSingleProduct);
// update single products => /api/v1/admin/update-product/:id
router.route('/admin/update-product/:id').put(updateSingleProduct);
// delete single products => /api/v1/admin/delete-product/:id
router.route('/admin/delete-product/:id').delete(deleteSingleProduct);
// delete multi products => /api/v1/admin/delete-products/
router.route('/admin/delete-products').delete(deleteMultiProduct);

module.exports = router;