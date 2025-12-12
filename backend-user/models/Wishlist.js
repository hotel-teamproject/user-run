import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, '사용자 ID가 필요합니다']
  },
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: [true, '호텔 ID가 필요합니다']
  },
  note: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// 중복 방지 인덱스 (한 사용자가 같은 호텔을 두 번 찜할 수 없음)
wishlistSchema.index({ userId: 1, hotelId: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

export default Wishlist;

