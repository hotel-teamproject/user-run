import axiosInstance from "./axiosConfig";

/**
 * 위시리스트 API Client
 */

/**
 * 내 위시리스트 조회
 */
export const getMyWishlist = async () => {
  const response = await axiosInstance.get("/etc/wishlist");
  return response.data.data || [];
};

/**
 * 위시리스트 토글 (추가/삭제)
 * @param {string} hotelId - 호텔 ID
 */
export const toggleWishlist = async (hotelId) => {
  const response = await axiosInstance.post(`/etc/wishlist/${hotelId}`);
  return response.data;
};

export default {
  getMyWishlist,
  toggleWishlist,
};

