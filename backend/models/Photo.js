const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Додайте назву фото'],
      trim: true,
      maxlength: [255, 'Назва фото не може бути довшою за 255 символів'],
    },
    url: {
      type: String,
      required: [true, 'Додайте URL фото'],
    },
    altText: {
      type: String,
      trim: true,
      maxlength: [255, 'Alt text не може бути довшим за 255 символів'],
    },
    publicId: {
      type: String,
    },
    category: {
      type: String,
      default: 'products',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Photo', PhotoSchema);
