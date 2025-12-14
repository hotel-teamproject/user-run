import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '이름을 입력해주세요'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '유효한 이메일을 입력해주세요']
  },
  password: {
    type: String,
    required: [true, '비밀번호를 입력해주세요'],
    minlength: [4, '비밀번호는 최소 4자 이상이어야 합니다'],
    select: false
  },
  phone: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'owner', 'admin'],
    default: 'user'
  },
  // 사업자 관련 정보
  businessInfo: {
    businessName: String,
    businessNumber: String,
    bankAccount: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    appliedAt: Date,
    approvedAt: Date
  },
  // 소셜 로그인 정보
  socialProvider: {
    type: String,
    enum: ['local', 'kakao', 'google']
  },
  socialId: String,
  
  refreshToken: String,
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 비밀번호 해싱 (저장 전)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 비밀번호 검증 메서드
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;