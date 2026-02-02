import User from "../model/UserModel.js";
import uploadToCloudinary from "../config/cloudinary.js";
import { io } from "../socket/socket.js";

// Get current logged-in user
export const getCurrentUser = async (req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
         if(!user){
            return res.status(400).json({message:"user does not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"get current user error"})
    }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found." });
    }

    const { name, bio } = req.body;
    let photoUrl;

    // Check if a new file has been uploaded
    if (req.file) {
      photoUrl = await uploadToCloudinary(req.file.buffer);

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
        bio: bio || req.user.bio,
        // Only add photoUrl to the update if it's a new, valid URL
        ...(photoUrl && { photoUrl }),
      },
      { new: true }
    ).select("-password");

    io.emit("profileUpdated", { userId: updatedUser._id, role: updatedUser.role });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: `Update profile failed: ${error.message}` });
  }
};

// Get users for chat sidebar
export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select("-password")
            .populate("enrolledCourses");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

// Delete profile (GDPR Compliance)
export const deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Logic to clear sessions/cookies should happen on frontend
        await User.findByIdAndDelete(req.userId);
        
        res.clearCookie("token", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });

        res.status(200).json({ message: "Account deleted successfully. We're sorry to see you go." });
    } catch (error) {
        console.error("Delete Profile Error:", error);
        res.status(500).json({ message: `Account deletion failed: ${error.message}` });
    }
};
