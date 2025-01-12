const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
} = require("../controllers/user.controller");
const { userRoles } = require("../helper/constant");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile);

module.exports = router;
