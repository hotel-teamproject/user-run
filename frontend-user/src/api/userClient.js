import axiosInstance from "./axiosConfig";

/**
 * User API Client
 * 사용자 관련 API 호출 함수 모음
 */

// ========================
// 인증 관련 API
// ========================

/**
 * 회원가입
 * @param {Object} userData - { name, email, password, phone }
 */
export const registerUser = async (userData) => {
  const response = await axiosInstance.post("/auth/register", userData);
  // 백엔드 응답 구조: { resultCode, message, data: { _id, name, email, phone, role, token, refreshToken } }
  if (response.data.data) {
    if (response.data.data.token) {
      localStorage.setItem("accessToken", response.data.data.token);
    }
    if (response.data.data.refreshToken) {
      localStorage.setItem("refreshToken", response.data.data.refreshToken);
    }
  }
  return response.data.data || response.data; // 사용자 데이터 반환
};

/**
 * 로그인
 * @param {Object} credentials - { email, password }
 */
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  // 백엔드 응답 구조: { resultCode, message, data: { _id, name, email, token, refreshToken } }
  
  // 에러 처리
  if (response.data.resultCode === 'FAIL' || !response.data.data) {
    const error = new Error(response.data.message || '로그인에 실패했습니다.');
    error.response = { data: response.data };
    throw error;
  }
  
  const userData = response.data.data;
  
  // 토큰 저장
  if (userData.token) {
    localStorage.setItem("accessToken", userData.token);
  }
  if (userData.refreshToken) {
    localStorage.setItem("refreshToken", userData.refreshToken);
  }
  
  return userData; // 실제 사용자 데이터 반환
};

/**
 * 로그아웃
 */
export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  return Promise.resolve();
};

/**
 * 현재 로그인한 사용자 정보 조회
 */
export const getCurrentUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  // 백엔드 응답 구조: { resultCode, message, data }
  return response.data.data || response.data;
};

// ========================
// 사용자 프로필 관련 API
// ========================

/**
 * 사용자 프로필 조회
 * @param {string} userId - 사용자 ID
 */
export const getUserProfile = async (userId) => {
  const response = await axiosInstance.get(`/users/${userId}`);
  return response.data;
};

/**
 * 사용자 프로필 수정
 * @param {string} userId - 사용자 ID
 * @param {Object} updateData - 수정할 데이터
 */
export const updateUserProfile = async (userId, updateData) => {
  const response = await axiosInstance.put(`/users/${userId}`, updateData);
  return response.data;
};

/**
 * 비밀번호 변경
 * @param {Object} passwordData - { currentPassword, newPassword }
 */
export const changePassword = async (passwordData) => {
  const response = await axiosInstance.put("/users/password", passwordData);
  return response.data;
};

// ========================
// 사업자 신청 관련 API
// ========================

/**
 * 사업자 신청
 * @param {Object} businessData - { businessName, businessNumber, bankAccount }
 */
export const applyBusiness = async (businessData) => {
  const response = await axiosInstance.post(
    "/users/business-apply",
    businessData
  );
  return response.data;
};

/**
 * 사업자 신청 상태 조회
 */
export const getBusinessStatus = async () => {
  const response = await axiosInstance.get("/users/business-status");
  return response.data;
};

// ========================
// 소셜 로그인 관련
// ========================

/**
 * 소셜 로그인
 * @param {Object} socialData - { provider, socialId, email, name, profileImage }
 */
export const socialLogin = async (socialData) => {
  const response = await axiosInstance.post("/auth/social", socialData);
  
  // 에러 처리
  if (response.data.resultCode === 'FAIL' || !response.data.data) {
    const error = new Error(response.data.message || '소셜 로그인에 실패했습니다.');
    error.response = { data: response.data };
    throw error;
  }
  
  const userData = response.data.data;
  
  // 토큰 저장
  if (userData.token) {
    localStorage.setItem("accessToken", userData.token);
  }
  if (userData.refreshToken) {
    localStorage.setItem("refreshToken", userData.refreshToken);
  }
  
  return userData;
};

// ========================
// 유틸리티 함수
// ========================

/**
 * 로그인 상태 확인
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("accessToken");
};

/**
 * 저장된 토큰 가져오기
 */
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

/**
 * 사용자 역할 확인
 * @param {string} role - 확인할 역할 (user, owner, admin)
 */
export const hasRole = async (role) => {
  try {
    const user = await getCurrentUser();
    return user.role === role;
  } catch (error) {
    return false;
  }
};

export default {
  // Auth
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  socialLogin,

  // Profile
  getUserProfile,
  updateUserProfile,
  changePassword,

  // Business
  applyBusiness,
  getBusinessStatus,

  // Utils
  isAuthenticated,
  getAccessToken,
  hasRole,
};
