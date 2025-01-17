const Medicine = require("../models/medicine.model.js");

class MedicineService {
  async createMedicine(data) {
    const medicine = new Medicine(data);
    await medicine.save();
    return medicine;
  }

  async getMedicines(filters, page = 1, limit = 10) {
    const medicines = await Medicine.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Medicine.countDocuments(filters);

    return { medicines, total, page, limit };
  }

  async getMedicineByIdOrSlug(identifier) {
    return Medicine.findOne({
      $or: [{ _id: identifier }, { slug: identifier }],
    });
  }

  async updateMedicine(id, data) {
    const medicine = await Medicine.findByIdAndUpdate(id, data, { new: true });
    return medicine;
  }

  async deleteMedicine(id) {
    return Medicine.findByIdAndDelete(id);
  }

  async getDiscountedPrice(id) {
    const medicine = await Medicine.findById(id);
    if (!medicine) throw new Error("Medicine not found");

    const discount = medicine.discountPercentage || 0;
    const discountedPrice = medicine.price - (medicine.price * discount) / 100;
    return { price: medicine.price, discount, discountedPrice };
  }

  async getSimilarGenerics(genericName, limit = 10) {
    try {
      const medicines = await Medicine.find({ generic: genericName })
        .limit(limit)
        .exec();
      return medicines;
    } catch (error) {
      throw new Error(
        "Error fetching similar generic medicines: " + error.message
      );
    }
  }
}

module.exports = new MedicineService();
