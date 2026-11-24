
import express from 'express';
import { getRecommendations } from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, (req, res, next) => {
    req.params.userId = req.user.id;
    next();
}, getRecommendations);

export default router;
