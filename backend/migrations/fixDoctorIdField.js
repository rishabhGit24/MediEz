const mongoose = require("mongoose");
require("dotenv").config();

const PatientSchema = require("../models/patientModel");

const fixDoctorIdField = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const patients = await PatientSchema.find({});

    let updatedCount = 0;

    for (const patient of patients) {
      if (!Array.isArray(patient.doctorId)) {
        patient.doctorId = [patient.doctorId];
        await patient.save();
        updatedCount++;
      }
    }

    console.log(
      `Updated doctorId field to array in ${updatedCount} patient documents.`
    );
    process.exit(0);
  } catch (error) {
    console.error("Error fixing doctorId field:", error);
    process.exit(1);
  }
};

fixDoctorIdField();
