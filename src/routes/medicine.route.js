const express = require("express");
const router = express.Router();
const {
  getMedicines,
  getMedicineByIdOrSlug,
  createMedicine,
  deleteMedicine,
  updateMedicine,
} = require("../controllers/medicine.controller");
const auth = require("../middlewares/auth.middleware");
const perimission = require("../middlewares/permission.middleware");
const upload = require("../middlewares/multer.middleware");

router.post("/", auth, perimission(["ADMIN"]), createMedicine);
router.get("/", getMedicines);
router.get("/:slug", getMedicineByIdOrSlug);
router.put("/:id", auth, perimission(["ADMIN"]), updateMedicine);
router.delete("/:id", auth, perimission(["ADMIN"]), deleteMedicine);

module.exports = router;
