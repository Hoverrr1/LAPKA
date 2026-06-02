const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    'items.product'
  );

  if (!cart) {
    return res.status(200).json({
      success: true,
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

// @desc    Add item to cart
// @route   POST /api/v1/cart
// @access  Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const quantity = Number(req.body.quantity);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return next(new ErrorResponse('Кількість товару має бути не менше 1', 400));
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(
      new ErrorResponse(`Товар не знайдено: ${productId}`, 404)
    );
  }

  // Check if product has enough stock
  if (product.stock < quantity) {
    return next(
      new ErrorResponse(
        `На складі доступно лише ${product.stock} шт. товару ${product.name}`,
        400
      )
    );
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    // Create new cart if doesn't exist
    cart = await Cart.create({
      user: req.user.id,
      items: [
        {
          product: productId,
          quantity,
          price: product.price,
        },
      ],
      total: product.price * quantity,
    });
  } else {
    // Check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update existing item
      const nextQuantity = cart.items[itemIndex].quantity + quantity;
      if (product.stock < nextQuantity) {
        return next(
          new ErrorResponse(
            `На складі доступно лише ${product.stock} шт. товару ${product.name}`,
            400
          )
        );
      }
      cart.items[itemIndex].quantity += quantity;
      cart.items[itemIndex].price = product.price;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    // Recalculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
  }

  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    data: updatedCart,
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/v1/cart/:itemId
// @access  Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const quantity = Number(req.body.quantity);

  if (!Number.isInteger(quantity) || quantity < 1) {
    return next(new ErrorResponse('Кількість товару має бути не менше 1', 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse('Cart item not found', 404));
  }

  // Check if product exists and has enough stock
  const product = await Product.findById(cart.items[itemIndex].product);
  if (!product) {
    return next(
      new ErrorResponse(
        `Товар не знайдено: ${cart.items[itemIndex].product}`,
        404
      )
    );
  }

  if (product.stock < quantity) {
    return next(
      new ErrorResponse(
        `На складі доступно лише ${product.stock} шт. товару ${product.name}`,
        400
      )
    );
  }

  // Update quantity
  cart.items[itemIndex].quantity = quantity;
  cart.items[itemIndex].price = product.price;

  // Recalculate total
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    data: updatedCart,
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/:itemId
// @access  Private
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );

  if (itemIndex === -1) {
    return next(new ErrorResponse('Cart item not found', 404));
  }

  // Remove item
  cart.items.splice(itemIndex, 1);

  // Recalculate total
  cart.total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate('items.product');

  res.status(200).json({
    success: true,
    data: updatedCart,
  });
});

// @desc    Clear cart
// @route   DELETE /api/v1/cart
// @access  Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse('Cart not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
