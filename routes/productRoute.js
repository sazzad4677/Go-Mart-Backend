const express = require('express');
const router = express.Router();

const { newProduct, getProducts, getSingleProduct, updateSingleProduct, deleteSingleProduct, deleteMultiProduct, deleteAllProduct } = require('../controllers/productController')

const {isAuthenticated, authorizeRoles} = require('../middleware/authMiddleware')

// add new products => /api/v1/product/new
router.route('/product/new').post(isAuthenticated,authorizeRoles('admin', 'seller'),newProduct);
// Get all products => /api/v1/products
router.route('/products').get(getProducts);
// Get single products => /api/v1/admin/product/:id
router.route('/admin/product/:id').get(getSingleProduct);
// update single products => /api/v1/admin/update-product/:id
router.route('/admin/update-product/:id').put(isAuthenticated,authorizeRoles('admin', 'seller'),updateSingleProduct);
// delete single products => /api/v1/admin/delete-product/:id
router.route('/admin/delete-product/:id').delete(isAuthenticated,authorizeRoles('admin', 'seller'),deleteSingleProduct);
// delete multi products => /api/v1/admin/delete-products/
router.route('/admin/delete-products').delete(isAuthenticated,authorizeRoles('admin', 'seller'),deleteMultiProduct);
// delete multi products => /api/v1/admin/delete-all-products/
router.route('/admin/delete-all-products').delete(isAuthenticated,authorizeRoles('admin', 'seller'),deleteAllProduct);

module.exports = router;