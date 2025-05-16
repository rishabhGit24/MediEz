require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const patientLoginSchema = new mongoose.Schema(
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
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DoctorSchema",
      required: true,
    },
  },
  { timestamps: true }
);

patientLoginSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

patientLoginSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this.patientId, doctorId: this.doctorId },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

patientLoginSchema.methods.comparePasswords = async function (
  candidatePassword
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("PatientLogin", patientLoginSchema);
