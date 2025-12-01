import { Router } from 'express';
import {
    getProductReviews,
    getUserReview,
    createReview,
    updateReview,
    deleteReview,
    getUserReviews,
} from '../controllers/review.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Authenticated routes
router.get('/my-reviews', authenticate, getUserReviews);
router.get('/product/:productId/my-review', authenticate, getUserReview);
router.post('/', authenticate, createReview);
router.put('/:id', authenticate, updateReview);
router.delete('/:id', authenticate, deleteReview);

export default router;