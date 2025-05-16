const mongoose = require("mongoose");
require("dotenv").config();

const PatientSchema = require("../models/patientModel");

const migrateDoctorIdToArray = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const result = await PatientSchema.updateMany(
      { doctorId: { $type: "objectId" } },
      [
        {
          $set: {
            doctorId: {
              $cond: [{ $isArray: "$doctorId" }, "$doctorId", ["$doctorId"]],
            },
          },
        },
      ]
    );

    console.log(`Migrated ${result.modifiedCount} patient documents.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

migrateDoctorIdToArray();
