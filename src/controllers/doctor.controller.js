const asyncHandler = require("express-async-handler");
const UserService = require("../services/user.service");
const AppointmentService = require("../services/appointment.service");

const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await UserService.getDoctors();
  res.json(doctors);
});

const getPaitents = asyncHandler(async (req, res) => {
  const paitents = await AppointmentService.getPaitents(req.user._id);
  res.json(paitents);
});

module.exports = { getAllDoctors, getPaitents };
