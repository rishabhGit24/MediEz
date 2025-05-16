require("dotenv").config();
const mongoose = require("mongoose");

const createPatientModel = (doctorId) => {
  const modelName = `Patient_${doctorId.toString()}`;

  if (mongoose.models[modelName]) {
    return mongoose.models[modelName];
  }

  const PatientSchema = new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: [true, "Please provide Name"],
        trim: true,
        maxlength: [20, "Name can not be longer than 20 characters"],
        match: [/^[a-zA-Z\s]*$/, "Please provide a valid Name"],
      },
      email: {
        type: String,
        required: [true, "Please provide an Email"],
        trim: true,
        lowercase: true,
      },
      bloodgroup: {
        type: String,
        trim: true,
      },
      gender: {
        type: String,
        required: [true, "Please provide Gender"],
      },
      age: {
        type: Number,
        required: [true, "Please provide Age"],
        min: [0, "Age must be at least 0 years old"],
        max: [100, "Age must be at most 100 years old"],
      },
      number: {
        type: String,
        required: [true, "Please provide Phone Number"],
        trim: true,
        maxlength: [10, "Phone Number cannot be more than 10 digits"],
        match: [/^[0-9]+$/, "Please provide a valid Phone Number"],
      },
      consultations: [
        {
          doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "DoctorSchema",
            required: true,
          },
          date: {
            type: Date,
            required: true,
            default: Date.now,
          },
        },
      ],
    },
    { timestamps: true }
  );

  const collectionName = `patients_${doctorId.toString()}`;

  return mongoose.model(modelName, PatientSchema, collectionName);
};

module.exports = createPatientModel;
