const SSLCommerzPayment = require("sslcommerz-lts");
require("dotenv").config();

const is_live = false;
const store_id = process.env.SSLCOMMERZ_STORE_ID;
const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD;

class PaymentService {
  async initiatePayment(prefix, transactionId, totalPrice, user) {
    if (!transactionId || !totalPrice || !user) {
      throw new Error(
        "Missing required parameters: transactionId, totalPrice, or user."
      );
    }

    const data = {
      total_amount: totalPrice,
      currency: "BDT",
      tran_id: transactionId,
      success_url: `${process.env.BASE_URL}/${prefix}/success`,
      fail_url: `${process.env.BASE_URL}/${prefix}/fail`,
      cancel_url: `${process.env.BASE_URL}/${prefix}/cancel`,
      ipn_url: `${process.env.BASE_URL}/${prefix}/ipn`,
      shipping_method: "Courier",
      product_name: "Medicines",
      product_category: "Healthcare",
      product_profile: "general",
      cus_name: user?.name || "Customer",
      cus_email: user?.email || "customer@example.com",
      cus_add1: "Dhaka",
      cus_add2: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1207",
      cus_country: "Bangladesh",
      cus_phone: user?.phone || "01700000000",
      ship_name: "Shipping Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: "1207",
      ship_country: "Bangladesh",
    };

    try {
      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
      const apiResponse = await sslcz.init(data);
      const GatewayPageURL = apiResponse.GatewayPageURL;
      return GatewayPageURL;
    } catch (error) {
      console.error("Payment initiation failed", error);
      throw new Error("Payment initiation failed. Please try again.");
    }
  }
}

module.exports = new PaymentService();
