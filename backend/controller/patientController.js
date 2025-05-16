const createPatientModel = require("../models/patientModel");
const Doctor = require("../models/doctorModel");
const Consultation = require("../models/consultationModel");

const chatbotService = {
  processSymptoms: async (symptoms, language) => {
    return {
      summary: `Response to symptoms: ${symptoms} in ${language || "en"}`,
    };
  },
};

exports.getRecentlyVisitedDoctors = async (req, res) => {
  try {
    console.log("req.user:", req.user);
    const patientId = req.user.id;
    const doctorId = req.user.doctorId;

    if (!doctorId) {
      console.log("Doctor ID not found in req.user");
      return res.status(400).json({
        success: false,
        message: "Doctor ID not found in user context",
      });
    }

    console.log(
      `Fetching patient with patientId: ${patientId}, doctorId: ${doctorId}`
    );

    const Patient = createPatientModel(doctorId);
    const patient = await Patient.findById(patientId)
      .populate({
        path: "consultations",
        populate: { path: "doctor", model: Doctor },
      })
      .lean()
      .catch((err) => {
        console.error("Error populating consultations.doctor:", err);
        return null;
      });

    console.log("Patient document:", patient);

    if (!patient) {
      console.log(
        `Patient not found for patientId: ${patientId}, doctorId: ${doctorId}`
      );
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    if (!patient.consultations || patient.consultations.length === 0) {
      console.log("No consultations found or array is empty for patient");
      return res.status(200).json({ success: true, data: [] }); // Ensure data is an array
    }

    const doctorsData = patient.consultations
      .filter((c) => c.doctor)
      .map((c) => ({
        _id: c.doctor._id,
        doctorId: c.doctor._id, // Match frontend expectation
        doctorName: c.doctor.fullName || "Unknown Doctor",
        specialization: c.doctor.specialization || "General Practitioner",
        experience: c.doctor.experience || 0,
        lastVisit: c.date || c.createdAt || new Date(),
      }));

    const uniqueDoctors = [];
    const seen = new Set();
    for (const doctor of doctorsData) {
      if (!seen.has(doctor._id.toString())) {
        uniqueDoctors.push(doctor);
        seen.add(doctor._id.toString());
      }
    }

    console.log("Recently Visited Unique Doctors:", uniqueDoctors);

    return res.status(200).json({ success: true, data: uniqueDoctors }); // Ensure data is an array
  } catch (error) {
    console.error("Server error in getRecentlyVisitedDoctors:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getChatbotResponse = async (req, res) => {
  try {
    const { symptoms, language } = req.body;
    if (!symptoms) {
      return res
        .status(400)
        .json({ success: false, message: "Symptoms are required" });
    }
    const response = await chatbotService.processSymptoms(symptoms, language);
    res.status(200).json({ success: true, ...response });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({ success: false, message: "Chatbot error" });
  }
};
