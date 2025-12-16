const mongoose = require('mongoose');

// 리뷰 스키마
const ReviewSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 1000 },
  images: [{ type: String }],
  isHelpful: { type: Number, default: 0 }, // 도움이 됨 투표수
  isVerified: { type: Boolean, default: false }, // 실제 이용 리뷰
}, { timestamps: true });

// 위시리스트 스키마
const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  note: { type: String, maxlength: 200 }
}, { timestamps: true });

// 쿠폰 스키마
const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['amount', 'percent'], 
    required: true 
  }, // 할인 타입
  discount: { type: Number, required: true }, // 금액 또는 %
  minAmount: { type: Number, default: 0 }, // 최소 주문금액
  maxDiscount: { type: Number }, // 최대 할인금액
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  usageLimit: { type: Number }, // 총 사용횟수 제한
  usedCount: { type: Number, default: 0 },
  isPublic: { type: Boolean, default: true }, // 공개 쿠폰
  target: { 
    type: String, 
    enum: ['all', 'first', 'member', 'hotel'], 
    default: 'all' 
  }
}, { timestamps: true });

// 포인트 거래 스키마
const PointTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['earn', 'use', 'refund', 'bonus'], 
    required: true 
  },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  refId: { type: String }, // 예약ID, 결제ID 등
  balanceAfter: { type: Number, required: true }
}, { timestamps: true });

// 문의 스키마
const InquirySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  type: { 
    type: String, 
    enum: ['hotel', 'reservation', 'payment', 'cancel', 'refund', 'etc'],
    required: true 
  },
  title: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true, maxlength: 2000 },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['pending', 'answered', 'closed'], 
    default: 'pending' 
  },
  answer: {
    content: String,
    answeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answeredAt: Date
  }
}, { timestamps: true });

// FAQ 스키마
const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true, maxlength: 200 },
  answer: { type: String, required: true, maxlength: 2000 },
  category: { 
    type: String, 
    enum: ['reservation', 'payment', 'cancel', 'hotel', 'point', 'etc'],
    required: true 
  },
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: true });

// 공지사항 스키마
const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  content: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['notice', 'event', 'maintenance', 'update'], 
    default: 'notice' 
  },
  isPinned: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  target: { type: String, enum: ['all', 'user', 'admin'], default: 'all' }
}, { timestamps: true });

// 구독 스키마
const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일을 입력해주세요'],
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed'],
    default: 'active'
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  }
}, { timestamps: true });

// 모델들 export (이미 존재하는 경우 기존 모델 사용)
module.exports = {
  Review: mongoose.models.Review || mongoose.model('Review', ReviewSchema),
  Wishlist: mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema),
  Coupon: mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema),
  PointTransaction: mongoose.models.PointTransaction || mongoose.model('PointTransaction', PointTransactionSchema),
  Inquiry: mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema),
  FAQ: mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema),
  Notice: mongoose.models.Notice || mongoose.model('Notice', NoticeSchema),
  Subscription: mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema)
};
