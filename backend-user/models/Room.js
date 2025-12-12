import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
    required: true
  },
  name: {
    type: String,
    required: [true, '객실 이름을 입력해주세요'],
    trim: true
  },
  description: {
    type: String,
    required: [true, '객실 설명을 입력해주세요']
  },
  type: {
    type: String,
    required: true,
    enum: ['standard', 'deluxe', 'suite', 'premium']
  },
  price: {
    type: Number,
    required: [true, '가격을 입력해주세요'],
    min: 0
  },
  maxGuests: {
    type: Number,
    required: [true, '최대 인원을 입력해주세요'],
    min: 1
  },
  images: [{
    type: String
  }],
  amenities: [{
    type: String
  }],
  size: {
    type: Number, // 평수 or m²
    required: true
  },
  bedType: {
    type: String,
    enum: ['single', 'double', 'queen', 'king', 'twin'],
    required: true
  },
  totalRooms: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['available', 'unavailable', 'maintenance'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 인덱스 설정
roomSchema.index({ hotel: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ status: 1 });

const Room = mongoose.model('Room', roomSchema);

export default Room;