import express from 'express';
import {
    cancelTossPayment,
    confirmTossPayment,
    getMyPayments,
    getPaymentDetail
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (인증 필요)
router.get('/my', protect, getMyPayments);
router.get('/:paymentId', protect, getPaymentDetail);
router.post('/toss/confirm', protect, confirmTossPayment);
router.post('/toss/cancel', protect, cancelTossPayment);

export default router;