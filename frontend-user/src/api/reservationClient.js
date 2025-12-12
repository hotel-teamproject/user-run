import axiosInstance from "./axiosConfig";

/**
 * 예약 API 클라이언트
 */

// 내 예약 목록 조회
export const getMyReservations = async () => {
 const response = await axiosInstance.get("/reservations/my");
 return response.data;
};

// 예약 상세 조회
export const getReservationDetail = async (reservationId) => {
 const response = await axiosInstance.get(`/reservations/${reservationId}`);
 return response.data;
};

// 예약 생성
export const createReservation = async (reservationData) => {
 const response = await axiosInstance.post("/reservations", reservationData);
 return response.data;
};

// 예약 취소
export const cancelReservation = async (reservationId, cancelReason = "") => {
 const response = await axiosInstance.patch(
  `/reservations/${reservationId}/cancel`,
  { cancelReason }
 );
 return response.data;
};

// 예약 가능한 객실 조회 (호텔별)
export const getAvailableRooms = async (params) => {
 const { hotelId, guests, checkIn, checkOut } = params;
 const response = await axiosInstance.get("/hotels/rooms", {
  params: { hotelId, guests, checkIn, checkOut },
 });
 return response.data;
};

export default {
 getMyReservations,
 getReservationDetail,
 createReservation,
 cancelReservation,
 getAvailableRooms,
};
