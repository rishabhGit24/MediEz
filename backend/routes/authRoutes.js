const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");

const {
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
} = require("../controller/authController");

router.post("/login", login);
router.post("/signup", signup);
router.post("/register", register);
router.get("/allPatients", authenticationMiddleware, allPatients);
router.get("/getPatient/:id", authenticationMiddleware, getPatient); // Added middleware
router.get("/openai/getText", getText);
router.post("/openai/getReport", getReport);
router.post("/saveReport", saveReport);
router.get("/getSummary/:id", getSummary);
router.post("/chat", chat);
router.delete("/deletePatient/:id", authenticationMiddleware, deletePatient);

module.exports = router;
