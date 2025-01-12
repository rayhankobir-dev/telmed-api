const express = require("express");
const router = express.Router();
const {
  getAllDoctors,
  getPaitents,
} = require("../controllers/doctor.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/", getAllDoctors);
router.get("/paitents", auth, getPaitents);

module.exports = router;
