import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// JWT 토큰 검증 미들웨어
export const protect = async (req, res, next) => {
  let token;

  // 1) Authorization 헤더에서 토큰 추출
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2) 헤더에 없으면 accessToken 쿠키에서 추출
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
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
    const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
    const decoded = jwt.verify(token, secret);

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

// 선택적 인증 미들웨어 (로그인하지 않아도 접근 가능, 로그인한 경우 user 정보 설정)
export const optionalAuth = async (req, res, next) => {
  let token;

  // 1) Authorization 헤더에서 토큰 추출
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2) 헤더에 없으면 accessToken 쿠키에서 추출
  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  // 토큰이 없으면 그냥 통과 (비회원)
  if (!token) {
    return next();
  }

  try {
    // 토큰 검증
    const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
    const decoded = jwt.verify(token, secret);

    // 사용자 정보 조회 (비밀번호 제외)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      // 사용자가 없어도 통과 (비회원으로 처리)
      return next();
    }

    next();
  } catch (error) {
    // 토큰이 유효하지 않아도 통과 (비회원으로 처리)
    next();
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

// JWT 토큰 생성 함수 (액세스 토큰: 기본 10분)
export const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'dev-secret-key-change-in-production';
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '10m'
  });
};

// Refresh 토큰 생성 함수 (기본 60분)
export const generateRefreshToken = (id) => {
  const secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-change-in-production';
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET is not configured');
  }
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '60m'
  });
};