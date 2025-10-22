const Image = require ('../models/images')
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper')
const fs = require('fs')

const uploadImage = async(req,res) => {
    try {
        // check if file is missing in req object
        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
                success: false
            })
        }

        const { url, publicId } = await uploadToCloudinary(req.file.path)

        const newlyUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId

        })

        await newlyUploadedImage.save()


        fs.unlinkSync(req.file.path)

        res.status(201).json({
            message: "Image uploaded successfully",
            success: true,
            image: newlyUploadedImage
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

const fetchImagesController = async(req,res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page -1) * limit
        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1
        const totalImages = await Image.countDocuments({})
        const totalPages = Math.ceil(totalImages/ limit)
        const sortObj = {}
        sortObj[sortBy] = sortOrder
        const images = await Image.find({}).skip(skip).limit(limit).sort(sortObj)
        if (images) {
            res.status(200).json({
                success: true,
                data: images,
                pagination: {
                    totalImages,
                    totalPages,
                    currentPage: page,
                    pageSize: limit
                }
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
        
    }
}

const deleteImageController = async(req,res) => {
    try {
        const { imageId } = req.params
        const image = await Image.findById(imageId)
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }

        // delete from cloudinary
        await deleteFromCloudinary(image.publicId)

        // delete from database
        await Image.findByIdAndDelete(imageId)

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server error"
        })
        
    }
}

module.exports = {
    uploadImage,
    fetchImagesController,
    deleteImageController
}