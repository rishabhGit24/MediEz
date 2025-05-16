const express = require("express");
const router = express.Router();
const authenticationMiddleware = require("../middleware/authentication");
const {
  getRecentlyVisitedDoctors,
  getChatbotResponse,
} = require("../controller/patientController");

router.get(
  "/recent-doctors",
  authenticationMiddleware,
  getRecentlyVisitedDoctors
);
router.post("/chatbot", getChatbotResponse);

module.exports = router;
