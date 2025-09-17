import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      // Use 401 for unauthorized access
      return res.status(401).json({
        message: "Unauthorized: No token provided. Please login.",
        success: false,
      });
    }

    // This will now fail gracefully if JWT_SECRET is missing
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);

    if (!req.user) {
        return res.status(404).json({
            message: "User not found.",
            success: false,
        });
    }

    next();
  } catch (error) {
    // Catch specific token errors for clearer messages
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            message: "Unauthorized: The token is invalid.",
            success: false,
        });
    }
    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            message: "Unauthorized: Your session has expired. Please login again.",
            success: false,
        });
    }

    // Fallback for any other errors
    res.status(500).json({
      message: `Server Error: ${error.message}`,
      success: false,
    });
  }
};

export default isAuth;