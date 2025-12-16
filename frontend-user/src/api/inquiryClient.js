import axiosInstance from "./axiosConfig";

/**
 * Inquiry API Client
 * 문의 관련 API 호출 함수 모음
 */

/**
 * 문의 등록
 * @param {Object} inquiryData - { hotelId, type, title, content, images }
 */
export const createInquiry = async (inquiryData) => {
  const response = await axiosInstance.post("/etc/inquiry", inquiryData);
  // 백엔드 응답 구조: { success: true, message: '문의가 등록되었습니다.', data: inquiry }
  return response.data.data;
};

/**
 * 내 문의 내역 조회
 * @param {Object} params - { page, limit, status }
 */
export const getUserInquiries = async (params = {}) => {
  const response = await axiosInstance.get("/etc/inquiry", { params });
  // 백엔드 응답 구조: { success: true, message: '문의 내역 조회 성공', data: inquiries }
  return response.data.data || [];
};

export default {
  createInquiry,
  getUserInquiries,
};

