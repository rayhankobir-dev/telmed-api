const express = require("express");
const {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
  updateProfile,
  changePassword,
  deleteUser,
} = require("../controllers/user.controller");
const { userRoles } = require("../helper/constant");
const auth = require("../middlewares/auth.middleware");
const permission = require("../middlewares/permission.middleware");
const upload = require("../middlewares/multer.middleware");

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", registerUser);
router.delete("/:id", auth, permission(["ADMIN"]), deleteUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile);
router.post("/change-password", auth, changePassword);
router.put("/profile", auth, upload.single("image"), updateProfile);

module.exports = router;
