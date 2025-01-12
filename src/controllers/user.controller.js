const AuthService = require("../services/auth.service");
const UserService = require("../services/user.service");
const asyncHandler = require("express-async-handler");
const { userRoles } = require("../helper/constant");

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const data = await AuthService.login(email, password);
  res.cookie("token", data.token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });
  res.json(data);
});

const registerUser = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = userRoles.USER,
  } = req.body;
  const user = await AuthService.register(
    firstName,
    lastName,
    email,
    password,
    role
  );
  res.status(201).json(user);
});

const addAdmin = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = userRoles.ADMIN,
  } = req.body;
  const user = await AuthService.register(
    firstName,
    lastName,
    email,
    password,
    role
  );
  res.status(201).json(user);
});

const addDoctor = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    role = userRoles.DOCTOR,
  } = req.body;
  const user = await AuthService.register(
    firstName,
    lastName,
    email,
    password,
    role
  );
  res.status(201).json(user);
});

const getAllUsers = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.role) {
    filter.role = req.query.role;
  }

  const users = await UserService.getAllUsers(filter);
  res.json(users);
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await UserService.getUserById(req.user._id);
  res.json(user);
});

module.exports = {
  loginUser,
  registerUser,
  addAdmin,
  addDoctor,
  getAllUsers,
  getProfile,
};
