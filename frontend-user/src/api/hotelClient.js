import axiosInstance from "./axiosConfig";

/**
 * Hotel API Client
 * 호텔 관련 API 호출 함수 모음
 */

// ========================
// 호텔 관련 API
// ========================

/**
 * 호텔 목록 조회
 * @param {Object} params - 검색 파라미터 (city, tags 등)
 */
export const getHotels = async (params) => {
  const response = await axiosInstance.get("/hotels", { params });
  return response.data.data;
};

/**
 * 호텔 상세 정보 조회
 * @param {string} hotelId - 호텔 ID
 */
export const getHotelDetail = async (hotelId) => {
  const response = await axiosInstance.get(`/hotels/${hotelId}`);
  return response.data.data;
};

/**
 * 호텔의 객실 목록 조회
 * @param {string} hotelId - 호텔 ID
 */
export const getHotelRooms = async (hotelId) => {
  const response = await axiosInstance.get(`/hotels/${hotelId}/rooms`);
  return response.data.data;
};

export default {
  getHotels,
  getHotelDetail,
  getHotelRooms,
};
