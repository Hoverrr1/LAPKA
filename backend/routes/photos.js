const express = require('express');
const { getPhotos, createPhoto, deletePhoto } = require('../controllers/photos');
const { protect, authorize } = require('../middleware/auth');
const { ensureCloudinaryConfigured } = require('../config/cloudinary');

const router = express.Router();

const checkCloudinaryConfig = (req, res, next) => {
  ensureCloudinaryConfigured();
  next();
};

router
  .route('/')
  .get(protect, authorize('admin'), getPhotos)
  .post(protect, authorize('admin'), checkCloudinaryConfig, createPhoto);

router.delete('/:id', protect, authorize('admin'), checkCloudinaryConfig, deletePhoto);

module.exports = router;
