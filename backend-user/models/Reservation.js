import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  checkIn: {
    type: Date,
    required: [true, '체크인 날짜를 입력해주세요']
  },
  checkOut: {
    type: Date,
    required: [true, '체크아웃 날짜를 입력해주세요']
  },
  guests: {
    type: Number,
    required: [true, '투숙 인원을 입력해주세요'],
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  cancelReason: String,
  cancelledAt: Date,
  
  specialRequests: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 인덱스 설정
reservationSchema.index({ user: 1, createdAt: -1 });
reservationSchema.index({ hotel: 1, checkIn: 1, checkOut: 1 });
reservationSchema.index({ status: 1 });

// 체크인 날짜가 체크아웃보다 앞인지 검증
reservationSchema.pre('save', function(next) {
  if (this.checkIn >= this.checkOut) {
    next(new Error('체크아웃 날짜는 체크인 날짜보다 이후여야 합니다'));
  }
  next();
});

const Reservation = mongoose.model('Reservation', reservationSchema);

export default Reservation;