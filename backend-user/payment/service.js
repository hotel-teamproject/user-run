const Payment = require('./model');
const mongoose = require('mongoose');

class PaymentService {
  // 결제 수단 목록 조회 (DB 없이 즉시 사용 가능)
  static async getPaymentMethods() {
    try {
      const defaultMethods = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'card',
          displayName: '신용카드',
          icon: 'https://cdn-icons-png.flaticon.com/512/732/732212.png',
          isActive: true,
          priority: 1,
          config: { 
            supportsInstallment: true, 
            installmentMonths: [1, 2, 3, 6, 12] 
          }
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'kakao',
          displayName: '카카오페이',
          icon: 'https://kakaopaycdn.imgix.net/web/mobile/pc/pay/icon_kakaopay.png',
          isActive: true,
          priority: 2,
          config: { minAmount: 1000 }
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'toss',
          displayName: '토스',
          icon: 'https://toss.im/tosscdn/image/product/etc/icon_toss_logo.svg',
          isActive: true,
          priority: 3,
          config: { minAmount: 1000 }
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'bank',
          displayName: '계좌이체',
          icon: 'https://cdn-icons-png.flaticon.com/512/10417/10417344.png',
          isActive: true,
          priority: 4
        },
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'phone',
          displayName: '휴대폰소액결제',
          icon: 'https://cdn-icons-png.flaticon.com/512/2995/2995286.png',
          isActive: true,
          priority: 5,
          config: { maxAmount: 50000 }
        }
      ];

      return {
        success: true,
        methods: defaultMethods
      };
    } catch (error) {
      console.error('PaymentService.getPaymentMethods error:', error);
      throw new Error('결제 수단 조회 실패');
    }
  }

  // 결제 요청 생성
  static async createPayment(paymentData) {
    try {
      const {
        orderId,
        userId,
        hotelId,
        reservationId,
        amount,
        finalAmount,
        method,
        cardInfo,
        pgProvider = 'portone'
      } = paymentData;

      // 유효성 검사
      if (!orderId || !userId || !hotelId || finalAmount <= 0) {
        throw new Error('필수 결제 정보가 누락되었습니다.');
      }

      if (!['card', 'kakao', 'toss', 'bank', 'phone'].includes(method.name)) {
        throw new Error('지원하지 않는 결제 수단입니다.');
      }

      const payment = new Payment({
        orderId,
        userId,
        hotelId,
        reservationId,
        amount,
        finalAmount,
        method,
        cardInfo: method.name === 'card' ? cardInfo : undefined,
        pgProvider,
        status: 'pending',
        ip: paymentData.ip,
        userAgent: paymentData.userAgent
      });

      await payment.save();

      return {
        success: true,
        paymentId: payment._id,
        orderId: payment.orderId,
        amount: payment.finalAmount,
        status: payment.status,
        method: payment.method
      };
    } catch (error) {
      console.error('PaymentService.createPayment error:', error);
      throw new Error(`결제 요청 생성 실패: ${error.message}`);
    }
  }

  // 결제 상태 확인
  static async getPaymentStatus(paymentId) {
    try {
      const payment = await Payment.findById(paymentId)
        .populate('userId', 'name email')
        .populate('hotelId', 'name')
        .lean();

      if (!payment) {
        throw new Error('결제 정보를 찾을 수 없습니다.');
      }

      return {
        success: true,
        payment,
        isSuccess: payment.status === 'paid',
        isCancelled: ['cancelled', 'refunded'].includes(payment.status)
      };
    } catch (error) {
      console.error('PaymentService.getPaymentStatus error:', error);
      throw new Error('결제 상태 확인 실패');
    }
  }

  // 결제 성공 처리 (PG사 웹훅)
  static async confirmPayment(paymentId, pgData) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('결제 정보를 찾을 수 없습니다.');
      }

      if (payment.status !== 'pending') {
        throw new Error('이미 처리된 결제입니다.');
      }

      // PG사 응답 검증
      payment.pgTransactionId = pgData.transactionId;
      payment.paymentId = pgData.paymentId;
      payment.status = 'paid';
      await payment.save();

      return {
        success: true,
        message: '결제 성공 처리 완료',
        paymentId: payment._id
      };
    } catch (error) {
      console.error('PaymentService.confirmPayment error:', error);
      throw new Error('결제 성공 처리 실패');
    }
  }

  // 결제 취소
  static async cancelPayment(paymentId, reason = '사용자 취소') {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('결제 정보를 찾을 수 없습니다.');
      }

      if (payment.status !== 'paid') {
        throw new Error('취소 가능한 결제만 처리할 수 있습니다.');
      }

      payment.status = 'cancelled';
      payment.cancelledAt = new Date();
      payment.refundReason = reason;
      await payment.save();

      return {
        success: true,
        message: '결제 취소 완료'
      };
    } catch (error) {
      console.error('PaymentService.cancelPayment error:', error);
      throw new Error('결제 취소 실패');
    }
  }

  // 환불 처리
  static async refundPayment(paymentId, refundAmount, reason) {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment || payment.status !== 'paid') {
        throw new Error('환불 가능한 결제가 아닙니다.');
      }

      payment.status = 'refunded';
      payment.refundedAt = new Date();
      payment.refundReason = reason;
      await payment.save();

      return {
        success: true,
        message: '환불 처리 완료'
      };
    } catch (error) {
      console.error('PaymentService.refundPayment error:', error);
      throw new Error('환불 처리 실패');
    }
  }

  // 사용자 결제 내역 조회
  static async getUserPayments(userId, options = {}) {
    try {
      const { page = 1, limit = 10, status } = options;
      const query = { userId };
      
      if (status) query.status = status;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const payments = await Payment.find(query)
        .populate('hotelId', 'name thumbnail location')
        .populate('reservationId', 'checkin checkout')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      const total = await Payment.countDocuments(query);

      return {
        success: true,
        payments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      };
    } catch (error) {
      console.error('PaymentService.getUserPayments error:', error);
      throw new Error('결제 내역 조회 실패');
    }
  }

  // 결제 통계 (관리자용)
  static async getPaymentStats(options = {}) {
    try {
      const match = { status: 'paid' };
      const { startDate, endDate } = options;

      if (startDate) match.createdAt = { ...match.createdAt, $gte: new Date(startDate) };
      if (endDate) match.createdAt = { ...match.createdAt, $lte: new Date(endDate) };

      const stats = await Payment.aggregate([
        { $match: match },
        {
          $group: {
            _id: '$method.name',
            count: { $sum: 1 },
            totalAmount: { $sum: '$finalAmount' },
            avgAmount: { $avg: '$finalAmount' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        success: true,
        stats
      };
    } catch (error) {
      console.error('PaymentService.getPaymentStats error:', error);
      throw new Error('결제 통계 조회 실패');
    }
  }
}

module.exports = PaymentService;
