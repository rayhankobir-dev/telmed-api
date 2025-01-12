const express = require("express");
const router = express.Router();
const {
  addPrescription,
  getUserPrescriptions,
  updatePrescription,
  deletedPrescription,
} = require("../controllers/prescription.controller");
const auth = require("../middlewares/auth.middleware");

router.get("/", auth, getUserPrescriptions);
router.post("/", auth, addPrescription);
router.patch("/:id", auth, updatePrescription);
router.delete("/:id", auth, deletedPrescription);

module.exports = router;
