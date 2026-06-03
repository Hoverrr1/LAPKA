const express = require('express');
const { getPhotos, createPhoto, deletePhoto } = require('../controllers/photos');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router
  .route('/')
  .get(protect, authorize('admin'), getPhotos)
  .post(protect, authorize('admin'), upload.single('image'), createPhoto);

router.delete('/:id', protect, authorize('admin'), deletePhoto);

module.exports = router;
