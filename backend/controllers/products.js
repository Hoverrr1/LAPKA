const Product = require('../models/Product');
const Photo = require('../models/Photo');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { getProductImageUrl } = require('../utils/unsplashImages');

const FILTER_FIELDS = [
  'category',
  'subcategory',
  'petType',
  'ageGroup',
  'flavor',
  'size',
  'material',
  'type',
];

const toList = (value) =>
  String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const resolveProductImage = async (payload = {}) => {
  const data = { ...payload };

  if (data.photo === '' || data.photo === null) {
    data.photo = null;
  }

  if (data.photo) {
    const photo = await Photo.findById(data.photo);
    if (!photo) throw new ErrorResponse('Вибране фото не знайдено', 404);
    data.photo = photo._id;
    data.image = photo.url;
    return data;
  }

  if (!data.image) {
    data.image = getProductImageUrl(data);
  }

  return data;
};

exports.getProducts = asyncHandler(async (req, res) => {
  const {
    ecoFriendly,
    search,
    minPrice,
    maxPrice,
    rating,
    inStock,
    page = 1,
    limit = 50,
  } = req.query;

  const query = {};

  FILTER_FIELDS.forEach((field) => {
    if (!req.query[field] || req.query[field] === 'All') return;
    const values = toList(req.query[field]);
    query[field] = values.length === 1 ? values[0] : { $in: values };
  });

  // Backward compatibility for catalog links created before the schema update.
  if (req.query.age && !query.ageGroup) query.ageGroup = { $in: toList(req.query.age) };
  if (req.query.itemType && !query.type) query.type = { $in: toList(req.query.itemType) };

  if (ecoFriendly === 'true') query.ecoFriendly = true;
  if (rating) query.rating = { $gte: Number(rating) };
  if (inStock === 'true') query.stock = { $gt: 0 };

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const [products, count] = await Promise.all([
    Product.find(query)
      .populate('photo')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize),
    Product.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count,
    pages: Math.ceil(count / pageSize),
    data: products,
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('photo');
  if (!product) return next(new ErrorResponse(`Товар з id ${req.params.id} не знайдено`, 404));
  res.status(200).json({ success: true, data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const productData = await resolveProductImage(req.body);
  const product = await Product.create(productData);
  await product.populate('photo');
  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const productData = await resolveProductImage(req.body);
  const product = await Product.findByIdAndUpdate(req.params.id, productData, {
    new: true,
    runValidators: true,
  }).populate('photo');
  if (!product) return next(new ErrorResponse(`Товар з id ${req.params.id} не знайдено`, 404));
  res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorResponse(`Товар з id ${req.params.id} не знайдено`, 404));
  await product.deleteOne();
  res.status(200).json({ success: true, data: {} });
});
