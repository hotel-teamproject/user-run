import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  method: {
    type: String,
    enum: ['toss', 'card', 'transfer', 'cash'],
    default: 'toss'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  // Toss Payments 관련 정보
  paymentKey: {
    type: String,
    unique: true,
    sparse: true
  },
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  tossOrderId: String,
  approvedAt: Date,
  
  // 환불 정보
  refund: {
    amount: Number,
    reason: String,
    refundedAt: Date
  },
  
  cancelReason: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 인덱스 설정
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ paymentKey: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;