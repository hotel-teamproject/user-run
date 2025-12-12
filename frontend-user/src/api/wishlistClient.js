import axiosInstance from "./axiosConfig";

/**
 * 위시리스트 API Client
 */

/**
 * 내 위시리스트 조회
 */
export const getMyWishlist = async () => {
  const response = await axiosInstance.get("/wishlist");
  return response.data.data || [];
};

/**
 * 위시리스트 토글 (추가/삭제)
 * @param {string} hotelId - 호텔 ID
 */
export const toggleWishlist = async (hotelId) => {
  const response = await axiosInstance.post(`/wishlist/${hotelId}`);
  return response.data;
};

/**
 * 호텔이 위시리스트에 있는지 확인
 * @param {string} hotelId - 호텔 ID
 */
export const checkWishlist = async (hotelId) => {
  const response = await axiosInstance.get(`/wishlist/check/${hotelId}`);
  return response.data.data?.isWishlisted || false;
};

export default {
  getMyWishlist,
  toggleWishlist,
};

