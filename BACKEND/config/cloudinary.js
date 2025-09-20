import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// --- Secure Configuration ---
// This version safely loads your credentials from the .env file.
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (filePath) => {
  if (!filePath) return null;

  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, { resource_type: "auto" });
    fs.unlinkSync(filePath); // remove temp file
    return uploadResult.secure_url;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.log("Error during Cloudinary upload:", error);
    return null;
  }
};

export default uploadToCloudinary;