const Order = require("../models/order.model"); // Assuming the Order model is in models/Order.js
const mongoose = require("mongoose");

class OrderService {
  // Create a new order
  static async createOrder(orderData) {
    try {
      const order = new Order(orderData);
      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Error creating order: ${error.message}`);
    }
  }

  // Get all orders with pagination
  static async getAllOrders(filter = {}) {
    try {
      const orders = await Order.find(filter)
        .populate("user", "name email")
        .populate(
          "medicines.medicine",
          "image name price generic dosageForm company"
        )
        .sort({ orderDate: -1 });
      return orders;
    } catch (error) {
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  // Get order by ID
  static async getOrderById(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid Order ID");
      }

      const order = await Order.findById(orderId)
        .populate("user", "name email")
        .populate("medicines.medicine", "name price");

      if (!order) {
        throw new Error("Order not found");
      }

      return order;
    } catch (error) {
      throw new Error(`Error fetching order: ${error.message}`);
    }
  }

  // Update order status
  static async updateOrderStatus(orderId, status) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid Order ID");
      }

      const order = await Order.findById(orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      if (!["pending", "delivered", "cancelled"].includes(status)) {
        throw new Error("Invalid status value");
      }

      order.status = status;
      await order.save();
      return order;
    } catch (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }
  }

  // Delete an order
  static async deleteOrder(orderId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("Invalid Order ID");
      }

      const order = await Order.findByIdAndDelete(orderId);
      if (!order) {
        throw new Error("Order not found");
      }

      return { message: "Order deleted successfully" };
    } catch (error) {
      throw new Error(`Error deleting order: ${error.message}`);
    }
  }

  // Get orders by user ID
  static async getOrdersByUserId(userId, page = 1, limit = 10) {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID");
      }

      const skip = (page - 1) * limit;
      const orders = await Order.find({ user: userId })
        .skip(skip)
        .limit(limit)
        .populate("user", "name email")
        .populate(
          "medicines.medicine",
          "image name dosageForm strength generic company price"
        )
        .sort({ orderDate: -1 });

      const totalOrders = await Order.countDocuments({ user: userId });
      const totalPages = Math.ceil(totalOrders / limit);

      return {
        orders,
        totalOrders,
        totalPages,
        currentPage: page,
      };
    } catch (error) {
      throw new Error(`Error fetching orders by user: ${error.message}`);
    }
  }

  // Calculate the total amount for an order
  static async calculateTotalPrice(medicines) {
    try {
      let totalPrice = 0;

      for (const { medicine, quantity } of medicines) {
        const foundMedicine = await Medicine.findById(medicine);
        if (!foundMedicine) {
          throw new Error("Medicine not found");
        }
        totalPrice += foundMedicine.price * quantity;
      }

      return totalPrice;
    } catch (error) {
      throw new Error(`Error calculating total price: ${error.message}`);
    }
  }
}

module.exports = OrderService;
