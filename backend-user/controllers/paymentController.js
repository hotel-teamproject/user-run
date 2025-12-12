import axios from 'axios';
import Payment from '../models/Payment.js';
import Reservation from '../models/Reservation.js';

// 내 결제 내역 조회
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort('-createdAt')
      .populate({
        path: 'reservation',
        populate: [
          { path: 'hotel', select: 'name city' },
          { path: 'room', select: 'name type' }
        ]
      });

    res.json({
      resultCode: 'SUCCESS',
      message: '결제 내역 조회 성공',
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 결제 상세 조회
export const getPaymentDetail = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate({
        path: 'reservation',
        populate: [
          { path: 'hotel', select: 'name address city' },
          { path: 'room', select: 'name type price' }
        ]
      });

    if (!payment) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '결제 정보를 찾을 수 없습니다',
        data: null
      });
    }

    // 본인의 결제만 조회 가능
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        resultCode: 'FAIL',
        message: '접근 권한이 없습니다',
        data: null
      });
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '결제 상세 조회 성공',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// Toss 결제 승인
export const confirmTossPayment = async (req, res) => {
  try {
    const { paymentKey, orderId, amount } = req.body;

    if (!paymentKey || !orderId || !amount) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '결제 정보가 올바르지 않습니다',
        data: null
      });
    }

    // Toss Payments API 호출
    const tossResponse = await axios.post(
      'https://api.tosspayments.com/v1/payments/confirm',
      {
        paymentKey,
        orderId,
        amount
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 결제 정보 저장
    const payment = await Payment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '결제 정보를 찾을 수 없습니다',
        data: null
      });
    }

    // 결제 승인 완료
    payment.status = 'completed';
    payment.paymentKey = paymentKey;
    payment.approvedAt = new Date();
    payment.tossOrderId = tossResponse.data.orderId;
    await payment.save();

    // 예약 상태 업데이트
    const reservation = await Reservation.findById(payment.reservation);
    if (reservation) {
      reservation.status = 'confirmed';
      reservation.paymentStatus = 'paid';
      reservation.payment = payment._id;
      await reservation.save();
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '결제가 완료되었습니다',
      data: payment
    });
  } catch (error) {
    // Toss API 에러 처리
    if (error.response) {
      return res.status(error.response.status).json({
        resultCode: 'FAIL',
        message: error.response.data.message || '결제 승인에 실패했습니다',
        data: null
      });
    }

    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// Toss 결제 취소
export const cancelTossPayment = async (req, res) => {
  try {
    const { paymentKey, cancelReason } = req.body;

    if (!paymentKey) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: 'paymentKey가 필요합니다',
        data: null
      });
    }

    // 결제 정보 조회
    const payment = await Payment.findOne({ paymentKey });

    if (!payment) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '결제 정보를 찾을 수 없습니다',
        data: null
      });
    }

    // 본인의 결제만 취소 가능
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        resultCode: 'FAIL',
        message: '본인의 결제만 취소할 수 있습니다',
        data: null
      });
    }

    // Toss Payments API 호출 (결제 취소)
    const tossResponse = await axios.post(
      `https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`,
      {
        cancelReason: cancelReason || '고객 요청'
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 결제 취소 완료
    payment.status = 'refunded';
    payment.refund = {
      amount: payment.amount,
      reason: cancelReason || '고객 요청',
      refundedAt: new Date()
    };
    await payment.save();

    // 예약 상태 업데이트
    const reservation = await Reservation.findById(payment.reservation);
    if (reservation) {
      reservation.status = 'cancelled';
      reservation.paymentStatus = 'refunded';
      await reservation.save();
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '결제가 취소되었습니다',
      data: payment
    });
  } catch (error) {
    // Toss API 에러 처리
    if (error.response) {
      return res.status(error.response.status).json({
        resultCode: 'FAIL',
        message: error.response.data.message || '결제 취소에 실패했습니다',
        data: null
      });
    }

    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};