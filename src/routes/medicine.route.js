const express = require("express");
const router = express.Router();
const {
  getMedicines,
  getMedicineByIdOrSlug,
} = require("../controllers/medicine.controller");

router.get("/", getMedicines);
router.get("/:slug", getMedicineByIdOrSlug);

module.exports = router;
