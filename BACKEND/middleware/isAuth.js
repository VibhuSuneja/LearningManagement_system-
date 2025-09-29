import jwt from "jsonwebtoken";
import User from "../model/UserModel.js";

export const isAuth = async (req, res, next) => {
  try {
    console.log("Incoming cookies:", req.cookies);

    const { token } = req.cookies;
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
    console.log("Authenticated user:", req.user);

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
