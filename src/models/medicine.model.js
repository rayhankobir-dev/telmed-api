const mongoose = require("mongoose");
const slugify = require("slugify");

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    strength: { type: String, required: true },
    generic: { type: String, required: true },
    dosageForm: { type: String, required: true },
    company: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    unit: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    indication: { type: String },
    sideEffects: { type: String },
    precautions: { type: String },
    contraindications: { type: String },
    pharmachology: { type: String },
    storage: { type: String },
    dosage: { type: String },
    pregnancy: { type: String },
    disclaimer: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medicine", medicineSchema);
