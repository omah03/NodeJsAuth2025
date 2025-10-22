const cloudinary = require('../config/cloudinary')

const uploadToCloudinary = async(filePath, folder) => {
    try {
        const result = await cloudinary.uploader.upload(filePath)
        return {
            url: result.secure_url,
            publicId: result.public_id
        }
        
    } catch (error) {
        console.log('Error uploading to Cloudinary:', error);
        throw new Error('Cloudinary upload failed');
    }
}

module.exports = { 
    uploadToCloudinary 
}