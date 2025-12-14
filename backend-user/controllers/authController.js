import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../middleware/auth.js';
import User from '../models/User.js';

// 회원가입
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // 비밀번호 유효성 검사
    if (!password || password.length < 4) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '비밀번호는 최소 4자 이상이어야 합니다',
        data: null
      });
    }

    // 이메일 중복 확인
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '이미 존재하는 이메일입니다',
        data: null
      });
    }

    // 사용자 생성
    const user = await User.create({
      name,
      email,
      password,
      phone,
      socialProvider: 'local'
    });

    // 토큰 생성
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 리프레시 토큰 저장
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      resultCode: 'SUCCESS',
      message: '회원가입이 완료되었습니다',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 로그인
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 이메일과 비밀번호 확인
    if (!email || !password) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '이메일과 비밀번호를 입력해주세요',
        data: null
      });
    }

    // 사용자 조회 (비밀번호 포함)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        resultCode: 'FAIL',
        message: '이메일 또는 비밀번호가 일치하지 않습니다',
        data: null
      });
    }

    // 비밀번호 검증
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        resultCode: 'FAIL',
        message: '이메일 또는 비밀번호가 일치하지 않습니다',
        data: null
      });
    }

    // 토큰 생성
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 리프레시 토큰 저장
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      resultCode: 'SUCCESS',
      message: '로그인에 성공했습니다',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token,
        refreshToken
      }
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 토큰 갱신
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        resultCode: 'FAIL',
        message: '리프레시 토큰이 없습니다',
        data: null
      });
    }

    // 리프레시 토큰 검증
    const secret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-key-change-in-production';
    const decoded = jwt.verify(refreshToken, secret);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        resultCode: 'FAIL',
        message: '유효하지 않은 리프레시 토큰입니다',
        data: null
      });
    }

    // 새 액세스 토큰 생성
    const newAccessToken = generateToken(user._id);

    res.json({
      resultCode: 'SUCCESS',
      message: '토큰이 갱신되었습니다',
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    res.status(401).json({
      resultCode: 'FAIL',
      message: '토큰 갱신에 실패했습니다',
      data: null
    });
  }
};

// 현재 사용자 정보 조회
export const getCurrentUser = async (req, res) => {
  try {
    res.json({
      resultCode: 'SUCCESS',
      message: '사용자 정보 조회 성공',
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};