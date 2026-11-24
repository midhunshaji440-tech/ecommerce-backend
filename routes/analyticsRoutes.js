
import express from 'express';
import { getRecommendations } from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/recommendations', protect, getRecommendations);

export default router;
