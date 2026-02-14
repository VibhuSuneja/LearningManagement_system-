import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// --- Secure Configuration ---
// This version safely loads your credentials from the .env file.
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (fileInput, resourceType = "auto") => {
  if (!fileInput) return null;

  try {
    // Handle buffer (production) or file path (local)
    if (Buffer.isBuffer(fileInput)) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        uploadStream.end(fileInput);
      });
    } else {
      // Your existing file path logic
      const uploadResult = await cloudinary.uploader.upload(fileInput, { resource_type: resourceType });
      fs.unlinkSync(fileInput); // remove temp file
      return uploadResult.secure_url;
    }
  } catch (error) {
    if (typeof fileInput === 'string' && fs.existsSync(fileInput)) {
      fs.unlinkSync(fileInput);
    }

    return null;
  }
};

export default uploadToCloudinary;
