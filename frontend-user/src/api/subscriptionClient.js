import axiosInstance from "./axiosConfig";

/**
 * Subscription API Client
 * 구독 관련 API 호출 함수 모음
 */

/**
 * 뉴스레터 구독 신청
 * @param {string} email - 구독할 이메일 주소
 */
export const subscribeNewsletter = async (email) => {
  const response = await axiosInstance.post("/etc/subscribe", { email });
  return response.data;
};

export default {
  subscribeNewsletter,
};

