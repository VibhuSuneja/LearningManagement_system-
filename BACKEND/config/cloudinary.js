import { v2 as cloudinary } from 'cloudinary'


import fs from 'fs'
cloudinary.config({ 
  cloud_name: 'my_cloud_name', 
  api_key: 'my_key', 
  api_secret: 'my_secret'
});

const uploadToCloudinary = async (filePath) => {
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

try {
    if(!filePath){
        return null
    }
    const uploadResult = await cloudinary.uploader.upload(filePath,
    {resource_type:"auto"})
    fs.unlinkSync(filePath)
    return uploadResult.secure_url
} catch (error) {
    fs.unlinkSync(filePath)
    console.log(error)
}
}

export default uploadToCloudinary