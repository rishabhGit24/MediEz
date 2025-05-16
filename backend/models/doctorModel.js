require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const DoctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide Name"],
      trim: true,
      maxlength: [20, "Name can not be longer than 20 characters"],
      match: [/^[a-zA-Z\s]*$/, "Please provide a valid Name"],
    },
    password: {
      type: String,
      required: [true, "Please provide Password"],
      trim: true,
      minlength: [8, "Password cannot be lesser than 8 characters"],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must have at least one uppercase letter, one lowercase letter, and one digit",
      ],
    },
    gender: {
      type: String,
      required: [true, "Please provide Gender"],
      enum: ["male", "female"],
    },
    age: {
      type: Number,
      required: [true, "Please provide Age"],
      min: [0, "Age must be at least 0 years old"],
      max: [100, "Age must be at most 100 years old"],
    },
    specialization: {
      type: String,
      default: "General Practitioner",
    },
  },
  { timestamps: true }
);

// Virtual field to alias fullName as name for population
DoctorSchema.virtual("name").get(function () {
  return this.fullName;
});

DoctorSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

DoctorSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET);
};

DoctorSchema.methods.comparePasswords = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("DoctorSchema", DoctorSchema);
