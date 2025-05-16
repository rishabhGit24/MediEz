const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/errors");
const DoctorSchema = require("../models/doctorModel");
const createPatientModel = require("../models/patientModel");
const PatientLoginSchema = require("../models/patientLoginModel");
const mongoose = require("mongoose");
const fs = require("fs");
const Openai = require("openai");
const ReportSchema = require("../models/reportModel");
const { detectLanguage, translateText } = require("./translation");
require("dotenv").config();

const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { fullName, password, role } = req.body;
  if (!fullName || !password || !role) {
    throw new BadRequestError("Please provide Full Name, Password, and Role");
  }

  if (role === "doctor") {
    const user = await DoctorSchema.findOne({ fullName });
    if (!user) throw new NotFoundError("Doctor Does Not Exist");
    const isMatch = await user.comparePasswords(password);
    if (!isMatch) throw new BadRequestError("Invalid Credentials");
    const token = user.createJWT();
    return res.status(StatusCodes.OK).json({
      data: {
        _id: user._id,
        fullName: user.fullName,
        age: user.age,
        gender: user.gender,
      },
      token,
      userType: "doctor",
    });
  } else if (role === "patient") {
    const user = await PatientLoginSchema.findOne({ fullName });
    if (!user) throw new NotFoundError("Patient Does Not Exist");
    const isMatch = await user.comparePasswords(password);
    if (!isMatch) throw new BadRequestError("Invalid Credentials");
    if (!user.doctorId) {
      throw new BadRequestError("Doctor ID not associated with this patient");
    }
    const token = user.createJWT();
    const PatientModel = createPatientModel(user.doctorId);
    const patientDetails = await PatientModel.findById(user.patientId);
    if (!patientDetails) {
      throw new NotFoundError("Patient details not found");
    }
    return res.status(StatusCodes.OK).json({
      data: {
        _id: patientDetails._id,
        fullName: patientDetails.fullName,
        age: patientDetails.age,
        gender: patientDetails.gender,
      },
      token,
      userType: "patient",
    });
  } else {
    throw new BadRequestError("Invalid role specified");
  }
};

const signup = async (req, res) => {
  const { fullName, password, rePassword, gender, age } = req.body;
  if (!fullName || !password || !rePassword || !gender || !age) {
    throw new BadRequestError("Please Fill In All The Fields");
  }
  if (password !== rePassword) {
    throw new BadRequestError("Passwords Do Not Match");
  }
  const userDetails = {
    fullName,
    password,
    gender,
    age,
  };
  const findUser = await DoctorSchema.findOne({ fullName });
  if (findUser) throw new BadRequestError("UserName Already Exists");
  const user = await DoctorSchema.create(userDetails);
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    data: {
      _id: user._id,
      fullName: user.fullName,
      age: user.age,
      gender: user.gender,
    },
    token,
  });
};

const register = async (req, res) => {
  const {
    fullName,
    email,
    bloodgroup,
    gender,
    number,
    age,
    password,
    doctorId,
  } = req.body;
  if (
    !fullName ||
    !email ||
    !bloodgroup ||
    !gender ||
    !number ||
    !age ||
    !password ||
    !doctorId
  ) {
    throw new BadRequestError("Please Fill In All The Fields");
  }

  // Validate doctorId exists
  const doctor = await DoctorSchema.findById(doctorId);
  if (!doctor) {
    throw new NotFoundError("Doctor not found");
  }

  const PatientModel = createPatientModel(doctorId);

  // Check if patient with same email exists in this doctor's collection
  const existingPatient = await PatientModel.findOne({ email });
  if (existingPatient) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "Patient already registered with this doctor",
    });
  }

  // Create new patient in this doctor's collection
  const userDetails = {
    fullName,
    email,
    bloodgroup,
    gender,
    number,
    age,
  };
  const user = await PatientModel.create(userDetails);

  // Create patient login credentials
  const patientLoginDetails = {
    fullName,
    password,
    patientId: user._id,
    doctorId: doctorId,
  };
  const patientLogin = await PatientLoginSchema.create(patientLoginDetails);

  res.status(StatusCodes.CREATED).json({
    status: "200",
    message: "Registered successfully",
  });
};

const allPatients = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }
  const doctorId = req.user.id;
  const Patient = createPatientModel(doctorId);
  const patients = await Patient.find();
  res.status(StatusCodes.OK).json({ data: patients });
};

const getPatient = async (req, res) => {
  const { id } = req.params;
  const doctorId = req.user.id;
  if (!doctorId) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Doctor ID not found in user context" });
  }
  const Patient = createPatientModel(doctorId);
  const patient = await Patient.findById(id);
  if (!patient) {
    throw new NotFoundError("Patient not found");
  }
  res.status(StatusCodes.OK).json({ data: patient });
};

const getText = async (req, res) => {
  const openai = new Openai({
    apiKey: process.env.API_KEY,
    dangerouslyAllowBrowser: true,
  });
  try {
    const text = await openai.audio.transcriptions.create({
      file: fs.createReadStream(
        "R:/CODE/WEBATHON/MediEase-20241019T090635Z-001/MediEase/backend/audioFiles/audio.webm"
      ),
      model: "whisper-1",
      response_format: "text",
    });
    fs.unlink(
      "R:/CODE/WEBATHON/MediEase-20241019T090635Z-001/MediEase/backend/audioFiles/audio.webm",
      (err) => {
        if (err) {
          console.error("Error removing file:", err);
          return;
        }
        console.log("File removed successfully");
      }
    );
    res.status(StatusCodes.OK).json({ text });
  } catch (error) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Failed to extract text" });
  }
};

const hindi = async (data) => {
  const targetLanguage = "hi";
  const detectedLanguage = await detectLanguage(data);
  console.log(`Detected language: ${detectedLanguage}`);
  const translation = await translateText(data, targetLanguage);
  return translation;
};

const kannada = async (data) => {
  const targetLanguage = "kn";
  const detectedLanguage = await detectLanguage(data);
  console.log(`Detected language: ${detectedLanguage}`);
  const translation = await translateText(data, targetLanguage);
  return translation;
};

const getReport = async (req, res) => {
  const { data } = req.body;
  const sum =
    data +
    ".For this give a layman explanation of the disease the patient is suffering from , to explain a patient attender";
  const medicine =
    data +
    ".Taking this as reference , if medications are prescribed , give the medication name and frequency of the prescribed medicines separated each with colon and format it appropriately";

  try {
    const openai = new Openai({
      apiKey: process.env.API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: sum }],
      model: "gpt-3.5-turbo",
    });

    const completion2 = await openai.chat.completions.create({
      messages: [{ role: "user", content: medicine }],
      model: "gpt-3.5-turbo",
    });

    const summary = completion.choices[0].message.content;
    const summary2 = completion2.choices[0].message.content;
    const hindiTranslation = await hindi(summary);
    const kannadaTranslation = await kannada(summary);
    res.status(StatusCodes.OK).json({
      summary,
      summary2,
      hindiTranslation,
      kannadaTranslation,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const saveReport = async (req, res) => {
  const { patientId, doctorId, summary } = req.body;
  if (!patientId || !doctorId || !summary)
    throw new BadRequestError("Please Fill In All The Fields");
  const userDetails = {
    patientId,
    doctorId,
    summary,
  };
  console.log(userDetails);
  const user = await ReportSchema.create(userDetails);
  res.status(StatusCodes.CREATED).json({
    status: "200",
    message: "Report created successfully",
  });
};

const getSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const summaries = await ReportSchema.find({ patientId: id });
    res.status(StatusCodes.OK).json({ data: summaries });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while retrieving summaries." });
  }
};

const chat = async (req, res) => {
  const { text } = req.body;
  const input =
    text +
    "IF ASKED ANY QUESTIONS NOT RELATED TO DOCTOR AND PATIENTS AND THEIR SYMPTOMS, ANSWER WITH -'NOT APPLICABLE', if not Give it in short and pointwise, add string at the end '-under the supervision of the doctor if not, consult the respective duty doctor' ";
  try {
    const openai = new Openai({
      apiKey: process.env.API_KEY,
      dangerouslyAllowBrowser: true,
    });

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: input }],
      model: "gpt-3.5-turbo",
    });

    const summary = completion.choices[0].message.content;
    res.status(StatusCodes.OK).json({
      summary,
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;
    const Patient = createPatientModel(doctorId);
    const deletedPatient = await Patient.findByIdAndDelete(id);
    if (!deletedPatient) {
      return res.status(404).send({ message: "Patient not found" });
    }
    // Also delete from PatientLoginSchema
    await PatientLoginSchema.deleteOne({ patientId: id });
    res.status(200).send({ message: "Patient deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting patient", error: error.message });
  }
};

module.exports = {
  login,
  signup,
  register,
  allPatients,
  getPatient,
  getText,
  getReport,
  saveReport,
  getSummary,
  chat,
  deletePatient,
};
