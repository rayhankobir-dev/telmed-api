const PaymentService = require("../services/payment.service");
const OrderService = require("../services/order.service");
const asyncHandler = require("express-async-handler");
const Order = require("../models/order.model");
const User = require("../models/user.model");
require("dotenv").config();

const initiatePayment = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const transactionId = `TNX${Date.now()}`;

    const url = await PaymentService.initiatePayment(
      "orders/payment",
      transactionId,
      order.totalPrice,
      order.user
    );

    order.transactionId = transactionId;
    await order.save();

    res.json({ url });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

const paymentSuccess = asyncHandler(async (req, res) => {
  try {
    const { tran_id } = req.body;

    const order = await Order.findOne({ transactionId: tran_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = "paid";
    order.paymentStatus = "completed";
    await order.save();

    res.redirect(`${process.env.CLIENT_URL}/payment-success`);
  } catch (error) {
    res.status(500).json({ message: "Payment success handling failed", error });
  }
});

const paymentFail = asyncHandler(async (req, res) => {
  try {
    const { tran_id } = req.body;

    const order = await Order.findOne({ transactionId: tran_id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = "failed";
    await order.save();

    res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
  } catch (error) {
    res.status(500).json({ message: "Payment failure handling failed", error });
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await OrderService.getAllOrders();
  res.json(orders);
});

const createOrder = asyncHandler(async (req, res) => {
  try {
    const { userId, medicines, totalPrice, totalDiscount } = req.body;

    if (!userId || !medicines || medicines.length === 0 || !totalPrice) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newOrder = new Order({
      user: userId,
      medicines,
      totalPrice,
      totalDiscount,
      status: "pending",
    });

    const savedOrder = await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await OrderService.getOrdersByUserId(userId);
  res.json(orders);
});

module.exports = {
  getAllOrders,
  createOrder,
  initiatePayment,
  paymentSuccess,
  paymentFail,
  getMyOrders,
};
