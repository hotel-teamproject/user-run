import axiosInstance from "./axiosConfig";

/**
 * 결제 수단 API 클라이언트
 */

// 내 결제 수단 목록 조회
export const getMyPaymentMethods = async () => {
 const response = await axiosInstance.get("/payment-methods");
 return response.data;
};

// 결제 수단 상세 조회
export const getPaymentMethodDetail = async (paymentMethodId) => {
 const response = await axiosInstance.get(
  `/payment-methods/${paymentMethodId}`
 );
 return response.data;
};

// 결제 수단 등록
export const addPaymentMethod = async (paymentMethodData) => {
 const response = await axiosInstance.post(
  "/payment-methods",
  paymentMethodData
 );
 return response.data;
};

// 결제 수단 수정
export const updatePaymentMethod = async (paymentMethodId, updateData) => {
 const response = await axiosInstance.patch(
  `/payment-methods/${paymentMethodId}`,
  updateData
 );
 return response.data;
};

// 결제 수단 삭제
export const deletePaymentMethod = async (paymentMethodId) => {
 const response = await axiosInstance.delete(
  `/payment-methods/${paymentMethodId}`
 );
 return response.data;
};

// 기본 결제 수단 설정
export const setDefaultPaymentMethod = async (paymentMethodId) => {
 const response = await axiosInstance.patch(
  `/payment-methods/${paymentMethodId}/default`
 );
 return response.data;
};

export default {
 getMyPaymentMethods,
 getPaymentMethodDetail,
 addPaymentMethod,
 updatePaymentMethod,
 deletePaymentMethod,
 setDefaultPaymentMethod,
};
