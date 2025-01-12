const mongoose = require("mongoose");
const { userRoles } = require("../helper/constant");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String },
    dateOfBirth: { type: Date },
    age: { type: Number },
    mobile: { type: String },
    address: { type: String },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.USER,
    },
    image: { type: String },
    title: { type: String },
    specialization: { type: String },
    experienceInYears: { type: Number },
    education: { type: String },
    degrees: { type: String },
    charge: { type: Number },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  this.fullName = `${this.firstName} ${this.lastName}`;
  this.age =
    new Date().getFullYear() - new Date(this.dateOfBirth).getFullYear();
  next();
});

module.exports = mongoose.model("User", userSchema);
