const express = require('express');
const router = express.Router();
const {
  getPaymentMethods,
  createPayment,
  getPaymentStatus,
  confirmPayment,
  cancelPayment,
  refundPayment,
  getUserPayments,
  getPaymentStats
} = require('./controller');

// 인증 미들웨어 (user 미들웨어에서 가져옴)
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: '인증이 필요합니다.'
    });
  }
  next();
};

// 관리자 권한 미들웨어
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

// 결제 수단 목록 조회
router.get('/methods', getPaymentMethods);

// ===== 인증 필요 API =====

// 결제 요청 생성
router.post('/', requireAuth, createPayment);

// 결제 상태 확인
router.get('/:paymentId', requireAuth, getPaymentStatus);

// 결제 취소
router.post('/:paymentId/cancel', requireAuth, cancelPayment);

// 사용자 결제 내역 조회
router.get('/my', requireAuth, getUserPayments);

// ===== PG사 웹훅 (인증 우회) =====

// 결제 성공 확인 (PG사 콜백)
router.post('/:paymentId/confirm', confirmPayment);

// ===== 관리자 전용 API =====

// 환불 처리
router.post('/:paymentId/refund', requireAuth, requireAdmin, refundPayment);

// 결제 통계
router.get('/stats', requireAuth, requireAdmin, getPaymentStats);

// ===== 추가 유틸 API =====

// 최근 결제 내역 (간단 조회)
router.get('/recent', requireAuth, async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const result = await require('./service').getUserPayments(req.user._id, {
      limit,
      status: 'paid'
    });

    return res.status(200).json({
      success: true,
      message: '최근 결제 내역 조회 성공',
      data: result.payments.slice(0, parseInt(limit))
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || '최근 결제 내역 조회 실패'
    });
  }
});

// 결제 수단별 통계 (관리자)
router.get('/stats/methods', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await require('./service').getPaymentStats({ startDate, endDate });

    return res.status(200).json({
      success: true,
      message: '결제 수단별 통계 조회 성공',
      data: result.stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || '결제 통계 조회 실패'
    });
  }
});

// 월별 결제 추이 (관리자)
router.get('/stats/monthly', requireAuth, requireAdmin, async (req, res) => {
  try {
    const Payment = require('./model');
    const stats = await Payment.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalAmount: { $sum: '$finalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    return res.status(200).json({
      success: true,
      message: '월별 결제 통계 조회 성공',
      data: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || '월별 통계 조회 실패'
    });
  }
});

module.exports = router;
