const cloudinary = require('../config/cloudinary');


const uploadToCloudinary = async (filepath) => {
  try {
    const result = await cloudinary
      .uploader
      .upload(filepath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    }
  } catch(err) {
    console.error(
      'Error uploading to cloudinary:',
      err
    );
    throw new Error('Error uploading cloudinary');
  }
}

module.exports = {
  uploadToCloudinary,
}