import axiosInstance from "./axiosConfig";

/**
 * 결제 API 클라이언트
 */

// 내 결제 내역 조회
export const getMyPayments = async () => {
 const response = await axiosInstance.get("/payments/my");
 return response.data;
};

// 결제 상세 조회
export const getPaymentDetail = async (paymentId) => {
 const response = await axiosInstance.get(`/payments/${paymentId}`);
 return response.data;
};

// Toss 결제 승인
export const confirmTossPayment = async (paymentData) => {
 const { paymentKey, orderId, amount } = paymentData;
 const response = await axiosInstance.post("/payments/toss/confirm", {
  paymentKey,
  orderId,
  amount,
 });
 return response.data;
};

// Toss 결제 취소
export const cancelTossPayment = async (paymentKey, cancelReason = "") => {
 const response = await axiosInstance.post("/payments/toss/cancel", {
  paymentKey,
  cancelReason,
 });
 return response.data;
};

export default {
 getMyPayments,
 getPaymentDetail,
 confirmTossPayment,
 cancelTossPayment,
};
