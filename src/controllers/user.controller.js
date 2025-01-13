const AuthService = require("../services/auth.service");
const UserService = require("../services/user.service");
const asyncHandler = require("express-async-handler");
const { userRoles } = require("../helper/constant");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

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

const updateProfile = asyncHandler(async (req, res) => {
  const updateData = {
    ...req.body,
  };

  if (req.file) {
    updateData.image = req.file.path;
  }

  const user = await UserService.updateUser(req.user._id, updateData);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(user);
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await UserService.getUserById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = {
  loginUser,
  registerUser,
  addAdmin,
  addDoctor,
  getAllUsers,
  getProfile,
  updateProfile,
  changePassword,
};
