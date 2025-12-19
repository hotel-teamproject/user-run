import express from 'express';
import {
    cancelReservation,
    createReservation,
    getMyReservations,
    getReservationDetail,
    getGuestReservations,
    getGuestReservationDetail,
    cancelGuestReservation
} from '../controllers/reservationController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (비회원 예약)
router.get('/guest', getGuestReservations);
router.get('/guest/:reservationId', getGuestReservationDetail);
router.patch('/guest/:reservationId/cancel', cancelGuestReservation);

// Protected routes (인증 필요) - optionalAuth로 변경하여 비회원도 예약 가능하도록
router.post('/', optionalAuth, createReservation);
router.get('/my', protect, getMyReservations);
router.get('/:reservationId', protect, getReservationDetail);
router.patch('/:reservationId/cancel', protect, cancelReservation);

export default router;