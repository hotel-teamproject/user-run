import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  maskedNumber: {
    type: String,
    required: true
  },
  expDate: {
    type: String,
    required: true
  },
  cvc: {
    type: String,
    required: true,
    select: false // 조회 시 기본적으로 제외
  },
  nameOnCard: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    enum: ['VISA', 'MASTERCARD', 'AMEX', 'JCB', 'DINERS'],
    default: 'VISA'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 사용자별 기본 카드는 하나만 존재하도록
cardSchema.index({ user: 1, isDefault: 1 });

const Card = mongoose.model('Card', cardSchema);

export default Card;

