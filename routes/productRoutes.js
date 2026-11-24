
import express from 'express';

import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// View all products (Public)
router.get('/', getProducts);

// View single product (Public)
router.get('/:id', getProductById);

// Create product (Admin only)
router.post('/', protect, authorize('admin'), createProduct);

// Update product (Admin only)
router.put('/:id', protect, authorize('admin'), updateProduct);

// Delete product (Admin only)
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
