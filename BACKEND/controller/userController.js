import User from "../model/UserModel.js";
import uploadToCloudinary from "../config/cloudinary.js";

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found." });
    }
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: `GetCurrent user error: ${error.message}` });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request File:", req.file);

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found." });
    }

    const { name, description } = req.body;
    let photoUrl;

    // Check if a new file has been uploaded
    if (req.file) {
      console.log("Uploading to Cloudinary...");
      photoUrl = await uploadToCloudinary(req.file.path);
      console.log("Cloudinary URL:", photoUrl);

      // --- ADDED ERROR HANDLING ---
      // If the file exists but the upload fails, stop and send an error.
      if (!photoUrl) {
        return res.status(500).json({ message: "Image upload failed. Please check server logs for details." });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        description: description || req.user.description,
        // Only add photoUrl to the update if it's a new, valid URL
        ...(photoUrl && { photoUrl }),
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: `Update profile failed: ${error.message}` });
  }
};