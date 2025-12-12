import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  getAvailableCoupons,
  getUserCoupons,
  applyCoupon
} from '../controllers/couponController.js';

const router = express.Router();

// 모든 쿠폰 라우트는 인증 필요
router.use(protect);

// 사용 가능한 쿠폰 목록 조회
router.get('/', getAvailableCoupons);

// 사용자 보유 쿠폰 목록 조회
router.get('/my', getUserCoupons);

// 쿠폰 적용
router.post('/apply', applyCoupon);

export default router;

