const mongoose = require("mongoose");
const createPatientModel = require("../models/patientModel");
const PatientLoginSchema = require("../models/patientLoginModel");

require("dotenv").config();

const fixPatientLoginDoctorId = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const patientLogins = await PatientLoginSchema.find({ doctorId: { $exists: false } });

    for (const login of patientLogins) {
      // We need to find doctorId by searching patient collections
      // Since patientModel creates collections per doctor, we need to check all doctors

      // Get all doctor IDs from DoctorSchema collection
      const DoctorSchema = require("../models/doctorModel");
      const doctors = await DoctorSchema.find({}, "_id");

      let foundDoctorId = null;

      for (const doctor of doctors) {
        const PatientModel = createPatientModel(doctor._id);
        const patient = await PatientModel.findById(login.patientId);
        if (patient) {
          foundDoctorId = doctor._id;
          break;
        }
      }

      if (foundDoctorId) {
        login.doctorId = foundDoctorId;
        await login.save();
        console.log(`Updated doctorId for patientLogin ${login._id}`);
      } else {
        console.warn(`DoctorId not found for patientLogin ${login._id}`);
      }
    }

    console.log("Migration completed.");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

fixPatientLoginDoctorId();
