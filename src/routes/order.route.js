const express = require("express");
const router = express.Router();
const {
  createOrder,
  initiatePayment,
  paymentSuccess,
  paymentFail,
  getMyOrders,
  getAllOrders,
  getAnalytics,
} = require("../controllers/order.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/analytics", getAnalytics);
router.get("/all", getAllOrders);
router.get("/", auth, getMyOrders);
router.post("/create", auth, createOrder);
router.post("/payment/initiate", initiatePayment);
router.post("/payment/success", paymentSuccess);
router.post("/payment/fail", paymentFail);

module.exports = router;
