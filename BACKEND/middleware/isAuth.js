import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";

export const isAuth = async (req, res, next) => {
  try {
    console.log("Incoming cookies:", req.cookies);
    console.log("Incoming headers:", req.headers.authorization);

    // Try to get token from cookies or Authorization header
    let token = req.cookies?.token;
    
    // Check Authorization header (Bearer <token>)
    if (!token && req.headers.authorization) {
      const parts = req.headers.authorization.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
        console.log("Token found in Authorization header");
      }
    }

    if (!token) {
      console.log("No token found in request!");
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided.", success: false });
    }

    // Verify JWT
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decodedData);

    // Use the correct key from your token
    const userId = decodedData.userId;
    if (!userId) {
      console.log("Token does not contain userId!");
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token payload.", success: false });
    }

    // Find user in DB
    const user = await User.findById(userId).select("-password");
    if (!user) {
      console.log("User not found in DB!");
      return res
        .status(404)
        .json({ message: "User not found.", success: false });
    }

    // Attach user to request
    req.user = user;
    req.userId = user._id.toString(); // CRITICAL: Convert ObjectId to string
    console.log("Authenticated user:", req.user);
    console.log("req.userId (string):", req.userId);

    next(); // proceed to next middleware or route
  } catch (error) {
    console.error("Auth middleware error:", error);

    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid token.", success: false });
    }

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          message: "Unauthorized: Token expired. Please login again.",
          success: false,
        });
    }

    return res
      .status(500)
      .json({ message: `Server error: ${error.message}`, success: false });
  }
};

export default isAuth;