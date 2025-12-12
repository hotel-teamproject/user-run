import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// JWT 토큰 검증 미들웨어
export const protect = async (req, res, next) => {
  let token;

  // Authorization 헤더에서 토큰 추출
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      resultCode: 'FAIL',
      message: '인증 토큰이 없습니다',
      data: null
    });
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 사용자 정보 조회 (비밀번호 제외)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        resultCode: 'FAIL',
        message: '사용자를 찾을 수 없습니다',
        data: null
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      resultCode: 'FAIL',
      message: '유효하지 않은 토큰입니다',
      data: null
    });
  }
};

// 역할 기반 접근 제어
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        resultCode: 'FAIL',
        message: '접근 권한이 없습니다',
        data: null
      });
    }
    next();
  };
};

// JWT 토큰 생성 함수
export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Refresh 토큰 생성 함수
export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};