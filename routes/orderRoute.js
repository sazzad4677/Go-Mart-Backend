const express = require('express');
const router = express.Router();
const { newOrder, getSingleOrder, myOrders, allOrders , updateOrder, deleteOrder} = require('../controllers/orderController')

const { isAuthenticated,authorizeRoles } = require('../middleware/authMiddleware')

router.route('/order/new').post(isAuthenticated, newOrder)
router.route('/order/:id').get(isAuthenticated, getSingleOrder)
router.route('/orders/me').get(isAuthenticated, myOrders)
router.route('/admin/orders/').get(isAuthenticated, authorizeRoles('admin'), allOrders)
router.route('/admin/order/:id').put(isAuthenticated, authorizeRoles('admin'), updateOrder)
router.route('/admin/order/:id').delete(authorizeRoles(isAuthenticated, 'admin'), deleteOrder)

module.exports = router;