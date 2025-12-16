import axiosInstance from "./axiosConfig";

/**
 * Notice API Client
 * 공지사항 관련 API 호출 함수 모음
 */

/**
 * 공지사항 목록 조회
 * @param {Object} params - { page, limit, type }
 */
export const getNotices = async (params = {}) => {
  const response = await axiosInstance.get("/etc/notices", { params });
  // 백엔드 응답 구조: { success: true, message: '공지사항 조회 성공', data: { success: true, notices, pagination } }
  return response.data.data || { notices: [], pagination: {} };
};

/**
 * 공지사항 상세 조회
 * @param {string} noticeId - 공지사항 ID
 */
export const getNoticeById = async (noticeId) => {
  const response = await axiosInstance.get(`/etc/notices/${noticeId}`);
  // 백엔드 응답 구조: { success: true, message: '공지사항 조회 성공', data: notice }
  return response.data.data;
};

export default {
  getNotices,
  getNoticeById,
};

