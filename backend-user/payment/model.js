const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ['card', 'kakao', 'toss', 'bank', 'naver', 'phone']
  },
  displayName: { 
    type: String, 
    required: true 
  }, // UI에 표시될 이름: "신용카드", "카카오페이" 등
  icon: { type: String }, // 아이콘 URL
  isActive: { 
    type: Boolean, 
    default: true 
  },
  priority: { 
    type: Number, 
    default: 0 
  }, // 표시 순서
  config: {
    minAmount: { type: Number, default: 0 }, // 최소 결제 금액
    maxAmount: { type: Number }, // 최대 결제 금액
    supportsInstallment: { type: Boolean, default: false }, // 무이자 할부 지원
    installmentMonths: { type: [Number], default: [] } // 지원 할부 개월수
  }
}, { _id: false });

const CardSchema = new mongoose.Schema({
  cardNumber: { 
    type: String, 
    required: true 
  },
  expiry: { 
    type: String, 
    required: true 
  }, // MM/YY
  cvc: { 
    type: String, 
    required: true 
  },
  holderName: { 
    type: String, 
    required: true 
  },
  cardType: { 
    type: String, 
    enum: ['visa', 'mastercard', 'amex', 'jcb', 'diners']
  },
  nickname: { 
    type: String 
  }, // 카드 별칭
  isDefault: { 
    type: Boolean, 
    default: false 
  }
}, { _id: false });

const PaymentSchema = new mongoose.Schema({
  // 결제 정보
  orderId: { 
    type: String, 
    required: true, 
    unique: true 
  }, // 예약ID 또는 주문ID
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  reservationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Reservation' 
  },
  
  // 금액 정보
  amount: { 
    type: Number, 
    required: true 
  },
  finalAmount: { 
    type: Number, 
    required: true 
  }, // 쿠폰/포인트 적용 후 최종 금액
  currency: { 
    type: String, 
    default: 'KRW' 
  },
  discount: {
    coupon: { type: Number, default: 0 },
    point: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },

  // 결제 수단
  method: { 
    type: PaymentMethodSchema, 
    required: true 
  },
  cardInfo: CardSchema, // 카드 결제 시
  pgProvider: { 
    type: String, 
    enum: ['portone', 'tosspayments', 'kcp', 'lgdacom']
  }, // PG사

  // 결제 상태
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'cancelled', 'refunded'],
    default: 'pending' 
  },
  pgTransactionId: { type: String }, // PG사 거래ID
  paymentId: { type: String }, // PG사 결제ID

  // 결제 상세
  installmentMonths: { 
    type: Number, 
    default: 0 
  },
  vatAmount: { 
    type: Number, 
    default: 0 
  },

  // 취소/환불 정보
  cancelledAt: { type: Date },
  refundedAt: { type: Date },
  refundReason: { type: String },

  // 메타 정보
  ip: { type: String },
  userAgent: { type: String },
  failReason: { type: String }
}, {
  timestamps: true
});

// 인덱스
PaymentSchema.index({ userId: 1, status: 1 });
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ status: 1, createdAt: -1 });
PaymentSchema.index({ hotelId: 1 });
PaymentSchema.index({ reservationId: 1 });

// 가상 필드
PaymentSchema.virtual('isSuccess').get(function() {
  return this.status === 'paid';
});

PaymentSchema.virtual('isCancelled').get(function() {
  return ['cancelled', 'refunded'].includes(this.status);
});

// JSON 변환 시 가상 필드 포함
PaymentSchema.set('toJSON', { virtuals: true });
PaymentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Payment', PaymentSchema);
