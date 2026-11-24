
import express from 'express';

import {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder
} from '../controllers/orderController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.patch('/:id/cancel', protect, cancelOrder);

// Admin routes
router.get('/', protect, authorize('admin'), getAllOrders);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;
