const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const {
  createOrder,
  getOrders,
  getAdminOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orders');

const router = express.Router();

router.use(protect);

// User routes
router.post('/', createOrder);
router.get('/me', getMyOrders);

// Admin routes
router.get('/', authorize('admin'), getOrders);
router.get('/admin', authorize('admin'), getAdminOrders);
router.get('/:id', authorize('admin'), getOrder);
router.put('/:id/status', authorize('admin'), updateOrderStatus);
router.delete('/:id', authorize('admin'), deleteOrder);

module.exports = router;
