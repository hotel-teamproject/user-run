import axiosInstance from "./axiosConfig";

/**
 * 카드 API 클라이언트
 * 카드 관련 API 호출 함수 모음
 */

/**
 * 사용자 카드 목록 조회
 */
export const getUserCards = async () => {
  const response = await axiosInstance.get("/cards");
  return response.data.data || [];
};

/**
 * 카드 추가
 * @param {Object} cardData - { cardNumber, expDate, cvc, nameOnCard, isDefault }
 */
export const addCard = async (cardData) => {
  const response = await axiosInstance.post("/cards", cardData);
  return response.data.data;
};

/**
 * 카드 삭제
 * @param {string} cardId - 카드 ID
 */
export const deleteCard = async (cardId) => {
  const response = await axiosInstance.delete(`/cards/${cardId}`);
  return response.data;
};

/**
 * 기본 카드 설정
 * @param {string} cardId - 카드 ID
 */
export const setDefaultCard = async (cardId) => {
  const response = await axiosInstance.put(`/cards/${cardId}/default`);
  return response.data.data;
};

export default {
  getUserCards,
  addCard,
  deleteCard,
  setDefaultCard,
};

