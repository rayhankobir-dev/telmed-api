const Prescription = require("../models/prescription.model");

class PrescriptionService {
  async createPrescription(userId, medicines, title, description) {
    try {
      const prescription = new Prescription({
        userId,
        title,
        description,
        medicines,
      });

      await prescription.save();
      return prescription;
    } catch (error) {
      throw new Error("Error creating prescription: " + error.message);
    }
  }

  async updatePrescription(prescriptionId, title, description, medicines) {
    try {
      const updatedPrescription = await Prescription.findByIdAndUpdate(
        prescriptionId,
        { title, description, medicines },
        { new: true }
      );

      if (!updatedPrescription) {
        throw new Error("Prescription not found");
      }

      return updatedPrescription;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deletePrescription(prescriptionId) {
    try {
      const deletedPrescription = await Prescription.findByIdAndDelete(
        prescriptionId
      );

      if (!deletedPrescription) {
        throw new Error("Prescription not found");
      }

      return deletedPrescription;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getPrescriptionsByUser(userId) {
    try {
      const prescriptions = await Prescription.find({ userId });

      return prescriptions;
    } catch (error) {
      throw new Error("Error fetching prescriptions: " + error.message);
    }
  }
}

module.exports = new PrescriptionService();
