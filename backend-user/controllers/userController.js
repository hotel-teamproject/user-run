import User from '../models/User.js';

// 사용자 프로필 조회
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '사용자를 찾을 수 없습니다',
        data: null
      });
    }

    // 본인 또는 관리자만 조회 가능
    if (req.user._id.toString() !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        resultCode: 'FAIL',
        message: '접근 권한이 없습니다',
        data: null
      });
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '프로필 조회 성공',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 사용자 프로필 수정
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // 본인만 수정 가능
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({
        resultCode: 'FAIL',
        message: '본인의 프로필만 수정할 수 있습니다',
        data: null
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { name, phone },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '사용자를 찾을 수 없습니다',
        data: null
      });
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '프로필 수정 완료',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 비밀번호 변경
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '현재 비밀번호와 새 비밀번호를 입력해주세요',
        data: null
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    // 현재 비밀번호 확인
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '현재 비밀번호가 일치하지 않습니다',
        data: null
      });
    }

    // 새 비밀번호 설정
    user.password = newPassword;
    await user.save();

    res.json({
      resultCode: 'SUCCESS',
      message: '비밀번호가 변경되었습니다',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 사업자 신청
export const applyBusiness = async (req, res) => {
  try {
    const { businessName, businessNumber, bankAccount } = req.body;

    if (!businessName || !businessNumber || !bankAccount) {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '모든 정보를 입력해주세요',
        data: null
      });
    }

    const user = await User.findById(req.user._id);

    if (user.businessInfo && user.businessInfo.status === 'pending') {
      return res.status(400).json({
        resultCode: 'FAIL',
        message: '이미 신청 대기 중입니다',
        data: null
      });
    }

    user.businessInfo = {
      businessName,
      businessNumber,
      bankAccount,
      status: 'pending',
      appliedAt: new Date()
    };

    await user.save();

    res.json({
      resultCode: 'SUCCESS',
      message: '사업자 신청이 완료되었습니다',
      data: user.businessInfo
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};

// 사업자 신청 상태 조회
export const getBusinessStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.businessInfo) {
      return res.status(404).json({
        resultCode: 'FAIL',
        message: '사업자 신청 내역이 없습니다',
        data: null
      });
    }

    res.json({
      resultCode: 'SUCCESS',
      message: '사업자 신청 상태 조회 성공',
      data: user.businessInfo
    });
  } catch (error) {
    res.status(500).json({
      resultCode: 'FAIL',
      message: error.message,
      data: null
    });
  }
};