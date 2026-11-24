
import express from 'express';

import {
    getMyProfile,
    updateMyProfile,
    deleteMyProfile,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
} from '../controllers/userProfile.js';

import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Logged-in user's profile
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);
router.delete('/me', protect, deleteMyProfile);

// Admin-only user management
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id', protect, authorize('admin'), updateUserById);
router.delete('/:id', protect, authorize('admin'), deleteUserById);

export default router;
