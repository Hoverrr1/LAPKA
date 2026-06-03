const Photo = require('../models/Photo');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const cloudinary = require('../config/cloudinary');

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

  if (!name) return next(new ErrorResponse('Вкажіть назву фото', 400));
  if (!req.file) return next(new ErrorResponse('Виберіть фото для завантаження', 400));

  const photo = await Photo.create({
    name,
    altText,
    url: req.file.secure_url || req.file.path,
    publicId: req.file.public_id || req.file.filename,
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

  if (photo.publicId) {
    await cloudinary.uploader.destroy(photo.publicId);
  }

  await photo.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
