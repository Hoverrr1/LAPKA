const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');

const FOLDER = 'lapka/products';

const parseCloudinaryUrl = () => {
  const value = process.env.CLOUDINARY_URL || '';
  const match = value.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
  if (!match) return {};

  return {
    apiKey: match[1],
    apiSecret: match[2],
    cloudName: match[3],
  };
};

const getCloudinaryConfig = () => {
  const parsed = parseCloudinaryUrl();

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || parsed.cloudName,
    apiKey: process.env.CLOUDINARY_API_KEY || parsed.apiKey,
    apiSecret: process.env.CLOUDINARY_API_SECRET || parsed.apiSecret,
  };
};

const ensureCloudinaryConfigured = () => {
  const config = getCloudinaryConfig();

  if (!config.cloudName || !config.apiKey || !config.apiSecret) {
    throw new ErrorResponse('Налаштуйте Cloudinary ключі у backend/.env', 400);
  }

  return config;
};

const signParams = (params, apiSecret) => {
  const payload = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return crypto.createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
};

const uploadImageToCloudinary = async (imageData) => {
  const { cloudName, apiKey, apiSecret } = ensureCloudinaryConfigured();
  const timestamp = Math.round(Date.now() / 1000);
  const signatureParams = {
    folder: FOLDER,
    timestamp,
  };

  const formData = new FormData();
  formData.append('file', imageData);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', FOLDER);
  formData.append('signature', signParams(signatureParams, apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json();

  if (!response.ok) {
    throw new ErrorResponse(result.error?.message || 'Не вдалося завантажити фото у Cloudinary', response.status);
  }

  return result;
};

const deleteImageFromCloudinary = async (publicId) => {
  if (!publicId) return;

  const { cloudName, apiKey, apiSecret } = ensureCloudinaryConfigured();
  const timestamp = Math.round(Date.now() / 1000);
  const signatureParams = {
    public_id: publicId,
    timestamp,
  };

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', apiKey);
  formData.append('timestamp', String(timestamp));
  formData.append('signature', signParams(signatureParams, apiSecret));

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    throw new ErrorResponse(result.error?.message || 'Не вдалося видалити фото з Cloudinary', response.status);
  }
};

module.exports = {
  ensureCloudinaryConfigured,
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
};
