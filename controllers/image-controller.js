const Image = require('../models/image');
const { uploadToCloudinary } = require('../helpers/cloudinaryHelper');
const cloudinary = require('../config/cloudinary');


const uploadImage = async (req, res) => {
  try {
    // Check if file is missing in request
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required.',
      })
    }

    // Upload to cloudinary
    const {
      url,
      publicId
    } = await uploadToCloudinary(req.file.path);

    // Store image and user info in database
    const newImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    })

    const savedImage = await newImage.save();

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      image: savedImage,
    })

  } catch(err) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong....'
      })
  }
}

const fetchImages = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOder === 'asc'
      ? 1 : -1; 

    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find()
      .sort(sortObj)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      currentPage: page,
      totalPages: totalPages,
      totalImages: totalImages,
      data: images,
    })
  } catch(err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please, try again.',
    })
  }
}

const deleteImage = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Delete Image from the database
    const matchingImage = await Image.findById(id);

    if (!matchingImage) {
      return res.status(404).json({
        success: false,
        message: 'Image Not Found',
      })
    }

    // Check if current user owns the image
    const { userId } = req.userInfo;

    if (!(userId === matchingImage
      .uploadedBy.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized operation.'
      })
    }

    // Delete Image from cloudinary
    cloudinary
      .uploader
      .destroy(matchingImage.publicId);

    // Delete image from the database
    matchingImage.deleteOne()

    res.json({
      success: true,
      message: 'Image deleted successfully',
    })

  } catch(err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Try again.',
    })
  }

}

module.exports = {
  uploadImage,
  fetchImages,
  deleteImage,
}