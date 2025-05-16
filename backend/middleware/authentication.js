const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../errors/errors");

const authenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No Bearer token found in Authorization header");
      throw new UnauthorizedError("Authentication invalid: No token provided");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.log("Token is empty");
      throw new UnauthorizedError("Authentication invalid: Empty token");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.userId) {
      console.log("Token payload does not contain userId:", payload);
      throw new UnauthorizedError("Authentication invalid: Missing userId");
    }

    req.user = {
      id: payload.userId,
      role: payload.role,
      doctorId: payload.doctorId || null,
    };
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    console.error("Authentication error:", error.message, error.stack);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired token" });
    }
    if (error instanceof UnauthorizedError) {
      return res.status(401).json({ success: false, message: error.message });
    }
    next(error); // Let errorHandlerMiddleware handle other errors
  }
};

module.exports = authenticationMiddleware;
