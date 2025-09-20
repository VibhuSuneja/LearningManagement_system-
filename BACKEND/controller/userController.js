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
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found." });
    }

    const { name, description } = req.body;
    let photoUrl;

    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.path);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || req.user.name,
        description: description || req.user.description,
        ...(photoUrl && { photoUrl }),
      },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: `Update profile failed: ${error.message}` });
  }
};
