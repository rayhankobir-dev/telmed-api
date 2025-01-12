const AppointmentService = require("../services/appointment.service");
const PaymentService = require("../services/payment.service");
const Appointment = require("../models/appointment.model");
const UserService = require("../services/user.service");
const asyncHandler = require("express-async-handler");
const { StreamClient } = require("@stream-io/node-sdk");
require("dotenv").config();

const apiKey = process.env.STREAM_API_KEY;
const secret = process.env.STREAM_API_SECRET;
client = new StreamClient(apiKey, secret);

const bookAppointment = asyncHandler(async (req, res) => {
  const { date, doctorId } = req.body;
  if (!date || !doctorId) {
    return res.status(400).json({ message: "Date and Doctor ID are required" });
  }

  try {
    const doctor = await UserService.getUserById(doctorId);
    const appointment = await AppointmentService.createAppointment(
      date,
      req.user._id,
      doctor._id,
      doctor.charge
    );

    const transactionId = `TNX${Date.now()}`;
    const url = await PaymentService.initiatePayment(
      "appointments/payment",
      transactionId,
      doctor.charge,
      req.user
    );

    appointment.transactionId = transactionId;
    await appointment.save();

    res.json({ url });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

const paymentSuccess = asyncHandler(async (req, res) => {
  try {
    const { tran_id } = req.body;

    const appointment = await Appointment.findOne({
      transactionId: tran_id,
    }).populate("doctor patient");

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "confirmed";
    appointment.paymentStatus = "paid";
    await appointment.save();
    const meeting = await scheduleCall(appointment);
    appointment.meetingId = meeting.call.id;
    appointment.meetingCid = meeting.call.cid;
    appointment.clientRequestId = meeting.metadata.clientRequestId;
    await appointment.save();

    res.redirect(`${process.env.CLIENT_URL}/payment-success`);
  } catch (error) {
    res.status(500).json({ message: "Payment success handling failed", error });
  }
});

const paymentFail = asyncHandler(async (req, res) => {
  try {
    const { tran_id } = req.body;

    const appointment = await Appointment.findOne({ transactionId: tran_id });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.paymentStatus = "failed";
    await appointment.save();

    res.redirect(`${process.env.CLIENT_URL}/payment-failed`);
  } catch (error) {
    res.status(500).json({ message: "Payment failure handling failed", error });
  }
});

const getDoctorAppointments = asyncHandler(async (req, res) => {
  const paitents = await Appointment.find({ doctor: req.user._id }).populate(
    "patient doctor"
  );

  res.json({ paitents });
});

const scheduleCall = async (appointment) => {
  const users = [
    {
      id: appointment.doctor._id,
      role: "user",
      custom: {
        color: "red",
      },
      name: appointment.doctor.fullName,
    },
    {
      id: appointment.patient._id,
      role: "user",
      custom: {
        color: "green",
      },
      name: appointment.patient.fullName,
    },
  ];

  await client.upsertUsers(users);
  const call = await client.video.call("default", `MEETING${Date.now()}`);
  const meeting = await call.create({
    data: { created_by_id: appointment.doctor._id },
  });

  return meeting;
};

const generateMeetingToken = asyncHandler(async (req, res) => {
  const user = req.user;
  const token = await client.generateUserToken({
    user_id: user._id,
  });
  res.json({ token });
});

const getUserAppointments = asyncHandler(async (req, res) => {
  const { past, upcomming } = req.query;
  const filter = {};
  if (past) {
    filter.date = { $lt: new Date() };
  }
  if (upcomming) {
    filter.date = { $gt: new Date() };
  }

  filter.patient = req.user._id;
  const appointments = await Appointment.find(filter).populate(
    "doctor patient"
  );
  res.json(appointments);
});

module.exports = {
  bookAppointment,
  getDoctorAppointments,
  paymentSuccess,
  paymentFail,
  generateMeetingToken,
  getUserAppointments,
};
