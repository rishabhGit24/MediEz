require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");

const app = express(); // Fixed: Use `const app` instead of `app`

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

const connectDB = require("./connectDB/connect");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const notFoundMiddleware = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected to MongoDB database");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
