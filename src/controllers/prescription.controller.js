const asyncHandler = require("express-async-handler");
const PrescriptionService = require("../services/prescription.service");

const getUserPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await PrescriptionService.getPrescriptionsByUser(
    req.user._id
  );
  res.json(prescriptions);
});

const addPrescription = asyncHandler(async (req, res) => {
  const { medicines, title, description } = req.body;

  if(!medicines || medicines.length === 0) {
    return res.status(400).json({ message: "Please provide prescription image" });
  }

  const prescription = await PrescriptionService.createPrescription(
    req.user._id,
    medicines,
    title,
    description
  );
  res.status(201).json(prescription);
});

const deletedPrescription = asyncHandler(async (req, res) => {
  const prescription = await PrescriptionService.deletePrescription(
    req.params.id
  );
  res.json({ message: "Prescription deleted successfully", prescription });
});

const updatePrescription = asyncHandler(async (req, res) => {
  const { title, description, medicines } = req.body;

  const prescription = await PrescriptionService.updatePrescription(
    req.params.id,
    title,
    description,
    medicines
  );
  res.json({ message: "Prescription updated successfully", prescription });
});

module.exports = {
  addPrescription,
  getUserPrescriptions,
  updatePrescription,
  deletedPrescription,
};
