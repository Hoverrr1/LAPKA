const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const ErrorResponse = require('../utils/errorResponse');

const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'lapka/products',
    allowed_formats: ALLOWED_FORMATS,
    resource_type: 'image',
  },
});

const fileFilter = (req, file, cb) => {
  const isAllowed = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
  if (!isAllowed) {
    cb(new ErrorResponse('Дозволені формати фото: JPG, JPEG, PNG або WEBP', 400));
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

module.exports = upload;
