import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '제목을 입력해주세요'],
    maxlength: [100, '제목은 최대 100자까지 입력 가능합니다']
  },
  content: {
    type: String,
    required: [true, '내용을 입력해주세요']
  },
  type: {
    type: String,
    enum: ['notice', 'event', 'maintenance', 'update'],
    default: 'notice'
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  target: {
    type: String,
    enum: ['all', 'user', 'admin'],
    default: 'all'
  }
}, {
  timestamps: true
});

// 인덱스 설정
noticeSchema.index({ isActive: 1, isPinned: -1, createdAt: -1 });
noticeSchema.index({ type: 1, isActive: 1 });

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;

