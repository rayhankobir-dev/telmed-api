const express = require("express");
const userRoutes = require("./user.route");
const orderRoutes = require("./order.route");
const doctorRoutes = require("./doctor.route");
const medicineRoutes = require("./medicine.route");
const appointmentRoutes = require("./appointment.route");
const prescriptionRoutes = require("./prescription.route");

const routes = express.Router();

routes.use("/users", userRoutes);
routes.use("/orders", orderRoutes);
routes.use("/doctors", doctorRoutes);
routes.use("/medicines", medicineRoutes);
routes.use("/appointments", appointmentRoutes);
routes.use("/prescriptions", prescriptionRoutes);

module.exports = routes;
