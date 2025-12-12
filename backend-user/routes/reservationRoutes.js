import express from 'express';
import {
    cancelReservation,
    createReservation,
    getMyReservations,
    getReservationDetail
} from '../controllers/reservationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (인증 필요)
router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.get('/:reservationId', protect, getReservationDetail);
router.patch('/:reservationId/cancel', protect, cancelReservation);

export default router;