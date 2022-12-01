const express = require('express');
const router = express.Router();

const { newProduct, getProducts, getSingleProduct, updateSingleProduct, deleteSingleProduct, deleteMultiProduct, deleteAllProduct, createProductReview, getProductReviews, deleteProductReviews } = require('../controllers/productController')

const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware')
router.route('/product/new').post(isAuthenticated, newProduct);
router.route('/products').get(getProducts);
router.route('/product/:id').get(getSingleProduct);
router.route('/admin/update-product/:id').put(isAuthenticated, updateSingleProduct);
router.route('/admin/delete-product/:id').delete(isAuthenticated, deleteSingleProduct);
router.route('/admin/delete-products').delete(isAuthenticated, deleteMultiProduct);
router.route('/admin/delete-all-products').delete(isAuthenticated, deleteAllProduct);
router.route('/review/').put(isAuthenticated, createProductReview);
router.route('/reviews').get(isAuthenticated, getProductReviews);
router.route('/reviews/').delete(isAuthenticated, deleteProductReviews);

module.exports = router;