import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { generateRefreshToken, generateToken } from '../middleware/auth.js';
import User from '../models/User.js';

// 공통 쿠키 옵션
const isProd = process.env.NODE_ENV === 'production';

const setAuthCookies = (res, accessToken, refreshToken) => {
  // accessToken: 10분, JS에서도 읽을 수 있는 쿠키
  res.cookie('accessToken', accessToken, {
    httpOnly: false,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 10 * 60 * 1000,
    path: '/',
  });

  // refreshToken: 60분, httpOnly 쿠키
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 60 * 60 * 1000,
    path: '/',
  });
};

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

    // 쿠키에 토큰 설정
    setAuthCookies(res, token, refreshToken);

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

    // 쿠키에 토큰 설정
    setAuthCookies(res, token, refreshToken);

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
    const bodyToken = req.body?.refreshToken;
    const cookieToken = req.cookies?.refreshToken;
    const refreshToken = bodyToken || cookieToken;

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

    // 액세스 토큰 쿠키 업데이트 (리프레시 토큰은 유지)
    res.cookie('accessToken', newAccessToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 10 * 60 * 1000,
      path: '/',
    });

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

// 소셜 로그인 (카카오, 구글, 애플)
export const socialLogin = async (req, res) => {
  try {
    const { provider, socialId, email, name, profileImage } = req.body;

    if (!provider || !socialId) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '소셜 로그인 정보가 필요합니다',
        data: null
      });
    }

    if (!['kakao', 'google', 'apple'].includes(provider)) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '지원하지 않는 소셜 로그인 제공자입니다',
        data: null
      });
    }

    // 소셜 ID로 기존 사용자 찾기
    let user = await User.findOne({ 
      socialProvider: provider,
      socialId: socialId 
    });

    if (!user) {
      // 이메일로도 확인 (이미 가입된 사용자일 수 있음)
      if (email) {
        user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
          // 기존 사용자에 소셜 정보 추가
          user.socialProvider = provider;
          user.socialId = socialId;
          if (profileImage) user.profileImage = profileImage;
          await user.save();
        }
      }

        // 신규 사용자 생성
        if (!user) {
          if (!name || !email) {
            return res.status(400).json({
              resultCode: 'FAIL',
              message: '이름과 이메일 정보가 필요합니다',
              data: null
            });
          }

          // 소셜 로그인 사용자 생성 (비밀번호 없이)
          user = await User.create({
            name,
            email: email.toLowerCase(),
            socialProvider: provider,
            socialId: socialId,
            profileImage: profileImage || ''
          });
        }
    }

    // 토큰 생성
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 리프레시 토큰 저장
    user.refreshToken = refreshToken;
    await user.save();

    // 쿠키에 토큰 설정
    setAuthCookies(res, token, refreshToken);

    res.json({
      resultCode: 'SUCCESS',
      message: '소셜 로그인에 성공했습니다',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        socialProvider: user.socialProvider || 'local',
        profileImage: user.profileImage || '',
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('소셜 로그인 오류:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message || '소셜 로그인에 실패했습니다',
      data: null
    });
  }
};

// 비밀번호 찾기 (이메일로 리셋 토큰 전송)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '이메일을 입력해주세요',
        data: null
      });
    }

    // 사용자 조회 (소셜 로그인 사용자는 제외)
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      $or: [
        { socialProvider: { $exists: false } },
        { socialProvider: 'local' }
      ]
    });

    if (!user) {
      // 보안을 위해 존재하지 않는 이메일이어도 성공 메시지 반환
      return res.json({
        resultCode: 'SUCCESS',
        message: '이메일로 비밀번호 재설정 링크를 전송했습니다',
        data: null
      });
    }

    // 리셋 토큰 생성
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 토큰과 만료 시간 저장 (10분)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10분
    await user.save({ validateBeforeSave: false });

    // 실제 프로덕션에서는 이메일로 리셋 토큰을 전송해야 함
    // 여기서는 개발 환경을 위해 토큰을 응답에 포함
    // 프로덕션에서는 이 부분을 제거하고 이메일로만 전송
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    // 개발 환경에서만 토큰 반환 (프로덕션에서는 제거)
    if (process.env.NODE_ENV !== 'production') {
      console.log('비밀번호 재설정 링크:', resetUrl);
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '이메일로 비밀번호 재설정 링크를 전송했습니다',
      data: process.env.NODE_ENV !== 'production' ? { resetToken, resetUrl } : null
    });
  } catch (error) {
    console.error('비밀번호 찾기 오류:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message || '비밀번호 찾기에 실패했습니다',
      data: null
    });
  }
};

// 비밀번호 재설정
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '토큰과 새 비밀번호를 입력해주세요',
        data: null
      });
    }

    if (password.length < 4) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '비밀번호는 최소 4자 이상이어야 합니다',
        data: null
      });
    }

    // 토큰 해시화
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 토큰과 만료 시간 확인
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '유효하지 않거나 만료된 토큰입니다',
        data: null
      });
    }

    // 비밀번호 변경
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({
      resultCode: 'SUCCESS',
      message: '비밀번호가 성공적으로 변경되었습니다',
      data: null
    });
  } catch (error) {
    console.error('비밀번호 재설정 오류:', error);
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message || '비밀번호 재설정에 실패했습니다',
      data: null
    });
  }
};