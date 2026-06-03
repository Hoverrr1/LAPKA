const Photo = require('../models/Photo');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { uploadImageToCloudinary, deleteImageFromCloudinary } = require('../config/cloudinary');

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const IMAGE_DATA_PATTERN = /^data:image\/(jpeg|jpg|png|webp);base64,/;

const getBase64Size = (imageData = '') => {
  const base64 = String(imageData).split(',')[1] || '';
  return Buffer.byteLength(base64, 'base64');
};

exports.getPhotos = asyncHandler(async (req, res) => {
  const photos = await Photo.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    count: photos.length,
    data: photos,
  });
});

exports.createPhoto = asyncHandler(async (req, res, next) => {
  const name = String(req.body.name || '').trim();
  const altText = String(req.body.altText || req.body.alt_text || '').trim();
  const imageData = String(req.body.imageData || '').trim();

  if (!name) return next(new ErrorResponse('Вкажіть назву фото', 400));
  if (!imageData) return next(new ErrorResponse('Виберіть фото для завантаження', 400));
  if (!IMAGE_DATA_PATTERN.test(imageData)) {
    return next(new ErrorResponse('Дозволені формати фото: JPG, JPEG, PNG або WEBP', 400));
  }
  if (getBase64Size(imageData) > MAX_FILE_SIZE) {
    return next(new ErrorResponse('Фото не може бути більшим за 5MB', 400));
  }

  const uploadedImage = await uploadImageToCloudinary(imageData);

  const photo = await Photo.create({
    name,
    altText,
    url: uploadedImage.secure_url || uploadedImage.url,
    publicId: uploadedImage.public_id,
    category: req.body.category || 'products',
  });

  res.status(201).json({
    success: true,
    data: photo,
  });
});

exports.deletePhoto = asyncHandler(async (req, res, next) => {
  const photo = await Photo.findById(req.params.id);
  if (!photo) return next(new ErrorResponse('Фото не знайдено', 404));

  await deleteImageFromCloudinary(photo.publicId);
  await photo.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
