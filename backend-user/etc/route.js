const express = require('express');
const router = express.Router();
const {
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
  getNoticeById
} = require('./controller');

// 인증 미들웨어
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '인증이 필요합니다.'
    });
  }
  next();
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '관리자 권한이 필요합니다.'
      });
    }
    next();
  };

// ===== 공개 API (인증 불필요) =====

// 호텔 리뷰 조회
router.get('/reviews/:hotelId', getHotelReviews);

// FAQ 조회
router.get('/faq', getFAQs);

// 공지사항 목록
router.get('/notices', getNotices);

// 공지사항 상세
router.get('/notices/:id', getNoticeById);

// ===== 인증 필요 API =====

// 리뷰 작성
router.post('/reviews', requireAuth, createReview);

// 위시리스트 토글
router.post('/wishlist/:hotelId', requireAuth, toggleWishlist);

// 내 위시리스트 조회
router.get('/wishlist', requireAuth, getUserWishlist);

// 사용 가능 쿠폰 조회
router.get('/coupons', requireAuth, getAvailableCoupons);

// 쿠폰 적용
router.post('/coupons/apply', requireAuth, applyCoupon);

// 포인트 내역 조회
router.get('/points', requireAuth, getUserPointHistory);

// 문의 등록
router.post('/inquiry', requireAuth, createInquiry);

// 내 문의 내역
router.get('/inquiry', requireAuth, getUserInquiries);

// ===== 추가 유틸 API =====

// 호텔 리뷰 통계
router.get('/reviews/:hotelId/stats', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const Review = require('./model').Review;
    
    const stats = await Review.aggregate([
      { $match: { hotelId: new require('mongoose').Types.ObjectId(hotelId) } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return res.status(200).json({
      success: true,
      message: '리뷰 통계 조회 성공',
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '리뷰 통계 조회 실패'
    });
  }
});

// 인기 쿠폰 (공개)
router.get('/coupons/popular', async (req, res) => {
  try {
    const { Coupon } = require('./model');
    const now = new Date();
    
    const coupons = await Coupon.find({
      isPublic: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    })
    .sort({ usedCount: -1 })
    .limit(10)
    .lean();

    return res.status(200).json({
      success: true,
      message: '인기 쿠폰 조회 성공',
      data: coupons
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '인기 쿠폰 조회 실패'
    });
  }
});

// 문의 통계 (관리자용)
router.get('/inquiry/stats', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { Inquiry } = require('./model');
    
    const stats = await Inquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      message: '문의 통계 조회 성공',
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: '문의 통계 조회 실패'
    });
  }
});

module.exports = router;
