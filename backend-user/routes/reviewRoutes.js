import express from 'express';
import {
    createReview,
    deleteReview,
    getHotelReviews,
    updateReview
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/hotels/:hotelId', getHotelReviews);

// Protected routes (인증 필요)
router.post('/', protect, createReview);
router.put('/:reviewId', protect, updateReview);
router.delete('/:reviewId', protect, deleteReview);

export default router;