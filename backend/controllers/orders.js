const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

const getStockError = (product) =>
  new ErrorResponse(
    `На складі доступно лише ${product.stock} шт. товару ${product.name}`,
    400
  );

const normalizeRequestedItems = (items) => {
  const groupedItems = new Map();

  items.forEach((item) => {
    const productId = String(item.product || '');
    const quantity = Number(item.quantity);

    if (!mongoose.isValidObjectId(productId) || !Number.isInteger(quantity) || quantity < 1) {
      throw new ErrorResponse('Перевірте кількість товарів у кошику', 400);
    }

    groupedItems.set(productId, (groupedItems.get(productId) || 0) + quantity);
  });

  return [...groupedItems.entries()].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
};

const getAvailableProducts = async (requestedItems, session) => {
  const query = Product.find({
    _id: { $in: requestedItems.map((item) => item.productId) },
  });
  if (session) query.session(session);

  const products = await query;
  const productsById = new Map(products.map((product) => [String(product._id), product]));

  return requestedItems.map(({ productId, quantity }) => {
    const product = productsById.get(productId);
    if (!product) throw new ErrorResponse(`Товар не знайдено: ${productId}`, 404);
    if (product.stock < quantity) throw getStockError(product);
    return { product, quantity };
  });
};

const buildOrderData = ({ userId, products, shippingAddress, paymentMethod }) => {
  const items = products.map(({ product, quantity }) => ({
    product: product._id,
    name: product.name,
    image: product.image,
    quantity,
    price: product.price,
  }));

  return {
    user: userId,
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'credit_card',
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: 'pending',
  };
};

const reserveStock = async (products, session, reserved = []) => {
  for (const { product, quantity } of products) {
    const options = session ? { session } : {};
    const result = await Product.updateOne(
      { _id: product._id, stock: { $gte: quantity } },
      { $inc: { stock: -quantity } },
      options
    );

    if (result.modifiedCount !== 1) {
      const query = Product.findById(product._id);
      if (session) query.session(session);
      const currentProduct = await query;
      if (!currentProduct) throw new ErrorResponse(`Товар не знайдено: ${product._id}`, 404);
      throw getStockError(currentProduct);
    }

    reserved.push({ productId: product._id, quantity });
  }

  return reserved;
};

const rollbackStock = async (reserved) => {
  if (!reserved.length) return;
  await Product.bulkWrite(
    reserved.map(({ productId, quantity }) => ({
      updateOne: {
        filter: { _id: productId },
        update: { $inc: { stock: quantity } },
      },
    }))
  );
};

const isTransactionUnsupported = (err) =>
  /Transaction numbers are only allowed|replica set member or mongos|does not support transactions/i.test(
    err.message || ''
  );

const createOrderWithTransaction = async (request) => {
  const session = await mongoose.startSession();
  let order;

  try {
    await session.withTransaction(async () => {
      const products = await getAvailableProducts(request.items, session);
      await reserveStock(products, session);
      [order] = await Order.create([buildOrderData({ ...request, products })], { session });
    });
    return order;
  } finally {
    await session.endSession();
  }
};

const createOrderWithRollback = async (request) => {
  const products = await getAvailableProducts(request.items);
  const reserved = [];

  try {
    await reserveStock(products, null, reserved);
    return await Order.create(buildOrderData({ ...request, products }));
  } catch (err) {
    await rollbackStock(reserved);
    throw err;
  }
};

// @desc    Create order
// @route   POST /api/v1/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  // Validate required fields
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return next(new ErrorResponse('Кошик не може бути порожнім', 400));
  }

  if (!shippingAddress) {
    return next(new ErrorResponse('Адреса доставки обов’язкова', 400));
  }

  const request = {
    userId: req.user.id,
    items: normalizeRequestedItems(items),
    shippingAddress,
    paymentMethod: paymentMethod || 'credit_card',
  };

  let order;
  try {
    order = await createOrderWithTransaction(request);
  } catch (err) {
    if (!isTransactionUnsupported(err)) throw err;
    order = await createOrderWithRollback(request);
  }

  // Populate user info
  await order.populate('user', 'name email');

  res.status(201).json({
    success: true,
    message: 'Замовлення успішно оформлено',
    data: order
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get all orders with complete checkout data (Admin)
// @route   GET /api/v1/orders/admin
// @access  Private/Admin
exports.getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email phone')
    .populate('items.product', 'name image price')
    .sort({ createdAt: -1 })
    .lean();

  const data = orders.map((order) => ({
    ...order,
    orderItems: order.items,
  }));

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
});

// @desc    Get user orders
// @route   GET /api/v1/orders/me
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get single order
// @route   GET /api/v1/orders/:id
// @access  Private/Admin
exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return next(
      new ErrorResponse(`Замовлення з id ${req.params.id} не знайдено`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PUT /api/v1/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new ErrorResponse('Статус замовлення обов\'язковий', 400));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Замовлення з id ${req.params.id} не знайдено`, 404)
    );
  }

  // Validate status
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(
      new ErrorResponse(`Недійсний статус замовлення: ${status}`, 400)
    );
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    message: 'Статус замовлення оновлено',
    data: order
  });
});

// @desc    Delete order
// @route   DELETE /api/v1/orders/:id
// @access  Private/Admin
exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`Замовлення з id ${req.params.id} не знайдено`, 404)
    );
  }

  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Замовлення видалено',
    data: {}
  });
});
