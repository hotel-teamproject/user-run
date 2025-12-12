const PaymentService = require('./service');
const mongoose = require('mongoose');

// 결제 수단 목록 조회
const getPaymentMethods = async (req, res) => {
  try {
    const result = await PaymentService.getPaymentMethods();

    return res.status(200).json({
      success: true,
      message: '결제 수단 조회 성공',
      data: result.methods
    });
  } catch (error) {
    console.error('getPaymentMethods error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '결제 수단 조회 실패'
    });
  }
};

// 결제 요청 생성
const createPayment = async (req, res) => {
  try {
    const paymentData = {
      orderId: req.body.orderId,
      userId: req.user._id, // 인증 미들웨어에서 설정
      hotelId: req.body.hotelId,
      reservationId: req.body.reservationId,
      amount: parseInt(req.body.amount),
      finalAmount: parseInt(req.body.finalAmount),
      method: req.body.method,
      cardInfo: req.body.cardInfo,
      pgProvider: req.body.pgProvider || 'portone',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    const result = await PaymentService.createPayment(paymentData);

    return res.status(201).json({
      success: true,
      message: '결제 요청 생성 성공',
      data: result
    });
  } catch (error) {
    console.error('createPayment error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || '결제 요청 생성 실패'
    });
  }
};

// 결제 상태 확인
const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({
        success: false,
        message: '유효하지 않은 결제 ID입니다.'
      });
    }

    const result = await PaymentService.getPaymentStatus(paymentId);

    return res.status(200).json({
      success: true,
      message: '결제 상태 조회 성공',
      data: result
    });
  } catch (error) {
    console.error('getPaymentStatus error:', error);
    return res.status(404).json({
      success: false,
      message: error.message || '결제 정보를 찾을 수 없습니다.'
    });
  }
};

// 결제 성공 처리 (PG사 웹훅)
const confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const pgData = req.body;

    const result = await PaymentService.confirmPayment(paymentId, pgData);

    return res.status(200).json({
      success: true,
      message: result.message,
      data: { paymentId: result.paymentId }
    });
  } catch (error) {
    console.error('confirmPayment error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || '결제 확인 실패'
    });
  }
};

// 결제 취소
const cancelPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { reason } = req.body;

    const result = await PaymentService.cancelPayment(paymentId, reason);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('cancelPayment error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || '결제 취소 실패'
    });
  }
};

// 환불 처리 (관리자용)
const refundPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { refundAmount, reason } = req.body;

    const result = await PaymentService.refundPayment(paymentId, refundAmount, reason);

    return res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('refundPayment error:', error);
    return res.status(400).json({
      success: false,
      message: error.message || '환불 처리 실패'
    });
  }
};

// 사용자 결제 내역 조회
const getUserPayments = async (req, res) => {
  try {
    const userId = req.user._id; // 인증 미들웨어에서 설정
    const { page = 1, limit = 10, status } = req.query;

    const result = await PaymentService.getUserPayments(userId, {
      page,
      limit,
      status
    });

    return res.status(200).json({
      success: true,
      message: '결제 내역 조회 성공',
      data: result
    });
  } catch (error) {
    console.error('getUserPayments error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '결제 내역 조회 실패'
    });
  }
};

// 결제 통계 (관리자용)
const getPaymentStats = async (req, res) => {
  try {
    // 관리자 권한 확인 필요 (미들웨어에서 처리)
    const { startDate, endDate } = req.query;

    const result = await PaymentService.getPaymentStats({
      startDate,
      endDate
    });

    return res.status(200).json({
      success: true,
      message: '결제 통계 조회 성공',
      data: result.stats
    });
  } catch (error) {
    console.error('getPaymentStats error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || '결제 통계 조회 실패'
    });
  }
};

module.exports = {
  getPaymentMethods,
  createPayment,
  getPaymentStatus,
  confirmPayment,
  cancelPayment,
  refundPayment,
  getUserPayments,
  getPaymentStats
};
