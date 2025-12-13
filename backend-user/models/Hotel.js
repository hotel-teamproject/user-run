import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '호텔 이름을 입력해주세요'],
    trim: true
  },
  description: {
    type: String,
    required: [true, '호텔 설명을 입력해주세요']
  },
  address: {
    type: String,
    required: [true, '주소를 입력해주세요']
  },
  city: {
    type: String,
    required: [true, '도시를 입력해주세요']
  },
  location: {
    type: String
  },
  image: {
    type: String
  },
  imageCount: {
    type: Number,
    default: 0
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  stars: {
    type: Number,
    min: 1,
    max: 5
  },
  basePrice: {
    type: Number,
    default: 0
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 인덱스 설정 (검색 성능 향상)
hotelSchema.index({ city: 1 });
hotelSchema.index({ tags: 1 });
hotelSchema.index({ rating: -1 });

const Hotel = mongoose.model('Hotel', hotelSchema);

export default Hotel;