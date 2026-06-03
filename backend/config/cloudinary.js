const cloudinary = require('cloudinary').v2;
const ErrorResponse = require('../utils/errorResponse');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureCloudinaryConfigured = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new ErrorResponse('Налаштуйте Cloudinary ключі у backend/.env', 400);
  }
};

const uploadImageToCloudinary = async (imageData) => {
  ensureCloudinaryConfigured();

  return await cloudinary.uploader.upload(imageData, {
    folder: 'lapka/products',
    resource_type: 'image',
  });
};

const deleteImageFromCloudinary = async (publicId) => {
  ensureCloudinaryConfigured();

  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId);
};

module.exports = {
  ensureCloudinaryConfigured,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};