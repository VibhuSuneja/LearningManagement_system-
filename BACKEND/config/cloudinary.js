import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

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
    fs.unlinkSync(filePath);
    console.log(error);
    return null; // important to return null if upload fails
  }
};

export default uploadToCloudinary;
