const express = require("express");
const router = express.Router();

const {
  processPayment,
  sendStripApi,
} = require("../controllers/paymentController");

const { isAuthenticated } = require('../middleware/authMiddleware')

router.route("/payment/process").post(processPayment);
router.route("/stripeapi").get(sendStripApi);

module.exports = router;
