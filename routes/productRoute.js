const express = require('express');
const router = express.Router();

const { newProduct, getProducts, getSingleProduct, updateSingleProduct, deleteSingleProduct, deleteMultiProduct, deleteAllProduct, createProductReview, getProductReviews, deleteProductReviews } = require('../controllers/productController')

const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware')
router.route('/product/new').post(isAuthenticated, authorizeRoles('admin', 'seller'), newProduct);
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/update-product/:id').put(isAuthenticated, authorizeRoles('admin', 'seller'), updateSingleProduct);
router.route('/admin/delete-product/:id').delete(isAuthenticated, authorizeRoles('admin', 'seller'), deleteSingleProduct);
router.route('/admin/delete-products').delete(isAuthenticated, authorizeRoles('admin', 'seller'), deleteMultiProduct);
router.route('/admin/delete-all-products').delete(isAuthenticated, authorizeRoles('admin', 'seller'), deleteAllProduct);
router.route('/review/').put(isAuthenticated, createProductReview);
router.route('/reviews/').get(isAuthenticated, getProductReviews);
router.route('/reviews/').delete(isAuthenticated, deleteProductReviews);

module.exports = router;