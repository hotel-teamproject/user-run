import express from 'express';
import {
    applyBusiness,
    changePassword,
    getBusinessStatus,
    getUserProfile,
    updateUserProfile
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protected routes (모든 인증된 사용자)
router.get('/:userId', protect, getUserProfile);
router.put('/:userId', protect, updateUserProfile);
router.put('/password', protect, changePassword);

// 사업자 신청 관련
router.post('/business-apply', protect, applyBusiness);
router.get('/business-status', protect, getBusinessStatus);

export default router;