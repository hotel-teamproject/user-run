import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, '쿠폰 코드를 입력해주세요'],
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, '쿠폰 이름을 입력해주세요'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['amount', 'percent'],
    required: [true, '할인 타입을 선택해주세요']
  },
  discount: {
    type: Number,
    required: [true, '할인 금액 또는 비율을 입력해주세요'],
    min: 0
  },
  minAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0
  },
  validFrom: {
    type: Date,
    required: [true, '유효 시작일을 입력해주세요']
  },
  validUntil: {
    type: Date,
    required: [true, '유효 종료일을 입력해주세요']
  },
  usageLimit: {
    type: Number,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  target: {
    type: String,
    enum: ['all', 'first', 'member', 'hotel'],
    default: 'all'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel'
  }
}, {
  timestamps: true
});

// 인덱스
couponSchema.index({ code: 1 });
couponSchema.index({ validFrom: 1, validUntil: 1 });
couponSchema.index({ userId: 1 });
couponSchema.index({ hotelId: 1 });

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;

