const express = require('express');
const ErrorResponse = require('../utils/errorResponse');
const { protect, authorize } = require('../middleware/auth');
const uploadProductImage = require('../middleware/upload');

const router = express.Router();

router.post(
  '/product',
  protect,
  authorize('admin'),
  uploadProductImage,
  (req, res, next) => {
    if (!req.file?.path) {
      return next(new ErrorResponse('Виберіть фото товару для завантаження', 400));
    }

    res.status(200).json({
      success: true,
      imageUrl: req.file.path,
    });
  }
);

module.exports = router;
