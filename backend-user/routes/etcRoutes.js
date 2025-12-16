import express from 'express';
import {
  // 리뷰
  createReview,
  getHotelReviews,
  // 위시리스트
  toggleWishlist,
  getUserWishlist,
  // 쿠폰
  getAvailableCoupons,
  applyCoupon,
  // 포인트
  getUserPointHistory,
  // 문의
  createInquiry,
  getUserInquiries,
  // FAQ
  getFAQs,
  // 공지사항
  getNotices,
  getNoticeById,
  // 구독
  subscribeNewsletter
} from '../etc/controller.js';

// 인증 미들웨어
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ===== 공개 API (인증 불필요) =====

// 호텔 리뷰 조회
router.get('/reviews/:hotelId', getHotelReviews);

// FAQ 조회
router.get('/faq', getFAQs);

// 공지사항 목록
router.get('/notices', getNotices);

// 공지사항 상세
router.get('/notices/:id', getNoticeById);

// 구독 신청 (공개 API)
router.post('/subscribe', subscribeNewsletter);

// ===== 인증 필요 API =====

// 리뷰 작성
router.post('/reviews', protect, createReview);

// 위시리스트 토글
router.post('/wishlist/:hotelId', protect, toggleWishlist);

// 내 위시리스트 조회
router.get('/wishlist', protect, getUserWishlist);

// 사용 가능 쿠폰 조회
router.get('/coupons', protect, getAvailableCoupons);

// 쿠폰 적용
router.post('/coupons/apply', protect, applyCoupon);

// 포인트 내역 조회
router.get('/points', protect, getUserPointHistory);

// 문의 등록
router.post('/inquiry', protect, createInquiry);

// 내 문의 내역
router.get('/inquiry', protect, getUserInquiries);

export default router;

