const crypto = require('crypto');
const fs = require('fs/promises');
const path = require('path');
const ErrorResponse = require('../utils/errorResponse');

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const UPLOAD_DIRECTORY = path.join(__dirname, '..', 'uploads', 'products');
const ALLOWED_FILES = new Map([
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
]);

const hasValidSignature = (buffer, mimetype) => {
  if (mimetype === 'image/jpeg') {
    return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimetype === 'image/png') {
    return buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (mimetype === 'image/webp') {
    return buffer.length >= 12
      && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
      && buffer.subarray(8, 12).toString('ascii') === 'WEBP';
  }

  return false;
};

const validateFile = (file) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const expectedMimeType = ALLOWED_FILES.get(extension);

  if (!expectedMimeType || expectedMimeType !== file.mimetype || !hasValidSignature(file.buffer, file.mimetype)) {
    throw new ErrorResponse('Дозволені формати фото: JPG, JPEG, PNG або WEBP', 400);
  }

  if (file.buffer.length > MAX_FILE_SIZE) {
    throw new ErrorResponse('Розмір фото не повинен перевищувати 5 MB', 400);
  }

  return extension;
};

const parseMultipartImage = async (req) => {
  const contentType = req.headers['content-type'] || '';
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

  if (!boundaryMatch) {
    throw new ErrorResponse('Надішліть фото у форматі multipart/form-data', 400);
  }

  const boundary = Buffer.from(`--${boundaryMatch[1] || boundaryMatch[2]}`);
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_FILE_SIZE + 1024 * 1024) {
      throw new ErrorResponse('Розмір фото не повинен перевищувати 5 MB', 400);
    }
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks);
  const headerEnd = body.indexOf(Buffer.from('\r\n\r\n'));
  if (headerEnd === -1) throw new ErrorResponse('Не вдалося прочитати фото', 400);

  const header = body.subarray(0, headerEnd).toString('utf8');
  const disposition = header.match(/name="image";\s*filename="([^"]+)"/i);
  const mimetype = header.match(/content-type:\s*([^\r\n]+)/i)?.[1]?.trim().toLowerCase();
  if (!disposition || !mimetype) {
    throw new ErrorResponse('Виберіть фото товару для завантаження', 400);
  }

  const fileStart = headerEnd + 4;
  const fileEnd = body.indexOf(Buffer.concat([Buffer.from('\r\n'), boundary]), fileStart);
  if (fileEnd === -1) throw new ErrorResponse('Не вдалося прочитати фото', 400);

  return {
    originalname: disposition[1],
    mimetype,
    buffer: body.subarray(fileStart, fileEnd),
  };
};

const uploadProductImage = async (req, res, next) => {
  try {
    const file = await parseMultipartImage(req);
    const extension = validateFile(file);
    const filename = `${crypto.randomUUID()}${extension}`;
    await fs.mkdir(UPLOAD_DIRECTORY, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIRECTORY, filename), file.buffer);

    req.file = {
      filename,
      mimetype: file.mimetype,
      path: `${req.protocol}://${req.get('host')}/uploads/products/${filename}`,
    };
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = uploadProductImage;
