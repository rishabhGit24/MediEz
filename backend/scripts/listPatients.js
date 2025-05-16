require("dotenv").config();
const mongoose = require("mongoose");
const createPatientModel = require("../models/patientModel");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/yourdbname";

const listPatients = async (doctorId) => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const Patient = createPatientModel(doctorId);

    const patients = await Patient.find();
    console.log(`Patients for doctorId ${doctorId}:`);
    patients.forEach((patient) => {
      console.log(`_id: ${patient._id}, fullName: ${patient.fullName}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error listing patients:", error);
    process.exit(1);
  }
};

// Replace with your actual doctorId
const doctorId = "680e098f7ceac36155c94376";

listPatients(doctorId);
