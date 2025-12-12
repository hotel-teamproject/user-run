import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  reservation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true
  },
  rating: {
    type: Number,
    required: [true, '평점을 입력해주세요'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, '리뷰 내용을 입력해주세요'],
    minlength: [10, '리뷰는 최소 10자 이상이어야 합니다'],
    maxlength: [1000, '리뷰는 최대 1000자까지 작성 가능합니다']
  },
  images: [{
    type: String
  }],
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 인덱스 설정
reviewSchema.index({ hotel: 1, createdAt: -1 });
reviewSchema.index({ user: 1 });

// 같은 예약에 대해 중복 리뷰 방지
reviewSchema.index({ reservation: 1 }, { unique: true });

// 업데이트 시 updatedAt 갱신
reviewSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;