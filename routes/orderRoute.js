const express = require('express');
const router = express.Router();
const { newOrder, getSingleOrder, myOrders, allOrders , updateOrder, deleteOrder} = require('../controllers/orderController')

const { authorizeRoles } = require('../middleware/authMiddleware')

router.route('/order/new').post(newOrder)
router.route('/order/:id').get(getSingleOrder)
router.route('/orders/me').get(myOrders)
router.route('/admin/orders/').get(authorizeRoles('admin'), allOrders)
router.route('/admin/order/:id').put(authorizeRoles('admin'), updateOrder)
router.route('/admin/order/:id').delete(authorizeRoles('admin'), deleteOrder)

module.exports = router;