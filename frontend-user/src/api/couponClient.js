import axiosInstance from "./axiosConfig";

/**
 * Coupon API Client
 * 쿠폰 관련 API 호출 함수 모음
 */

/**
 * 사용 가능한 쿠폰 목록 조회
 * @param {number} minAmount - 최소 주문 금액
 */
export const getAvailableCoupons = async (minAmount = 0) => {
  const response = await axiosInstance.get("/coupons", {
    params: { minAmount }
  });
  return response.data.data || [];
};

/**
 * 사용자 보유 쿠폰 목록 조회 (사용 가능 + 만료)
 */
export const getUserCoupons = async () => {
  const response = await axiosInstance.get("/coupons/my");
  return response.data.data || { available: [], expired: [], all: [] };
};

/**
 * 쿠폰 적용
 * @param {string} code - 쿠폰 코드
 * @param {number} amount - 주문 금액
 */
export const applyCoupon = async (code, amount) => {
  const response = await axiosInstance.post("/coupons/apply", {
    code,
    amount
  });
  return response.data.data;
};

export default {
  getAvailableCoupons,
  getUserCoupons,
  applyCoupon
};

