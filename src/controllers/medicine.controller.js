const asyncHandler = require("express-async-handler");
const MedicineService = require("../services/medicine.service");

const getMedicines = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, keyword } = req.query;
  const filters = {};

  if (keyword) {
    filters.name = { $regex: keyword, $options: "i" };
  }

  const medicines = await MedicineService.getMedicines(filters, page, limit);
  res.json(medicines);
});

const getMedicineByIdOrSlug = asyncHandler(async (req, res) => {
  const medicine = await MedicineService.getMedicineByIdOrSlug(req.params.slug);
  const alternatives = await MedicineService.getSimilarGenerics(
    medicine.generic
  );
  res.json({ medicine, alternatives });
});

const createMedicine = asyncHandler(async (req, res) => {
  const medicine = await MedicineService.createMedicine(req.body);
  res.status(201).json(medicine);
});

const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await MedicineService.updateMedicine(
    req.params.id,
    req.body
  );
  res.json(medicine);
});

const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await MedicineService.deleteMedicine(req.params.id);
  res.json(medicine);
});

module.exports = {
  getMedicines,
  getMedicineByIdOrSlug,
  createMedicine,
  updateMedicine,
  deleteMedicine,
};
