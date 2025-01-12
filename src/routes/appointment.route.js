const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getDoctorAppointments,
  paymentSuccess,
  paymentFail,
  generateMeetingToken,
  getUserAppointments,
} = require("../controllers/appointment.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/paitents", auth, getDoctorAppointments);
router.get("/my", auth, getUserAppointments);
router.post("/book", auth, bookAppointment);
router.post("/generate-meeting-token", auth, generateMeetingToken);
router.post("/payment/success", paymentSuccess);
router.post("/payment/fail", paymentFail);

module.exports = router;
