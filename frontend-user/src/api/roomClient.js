import axiosInstance from "./axiosConfig";

// Room API Client
// 객실 관련 API 호출 함수 모음


// @param {string} roomId - 객실 ID
export const getRoomDetail = async (roomId) => {
  const response = await axiosInstance.get(`/rooms/${roomId}`);
  return response.data.data;
};

// @param {string} hotelId - 호텔 ID
export const getRoomsByHotel = async (hotelId) => {
  const response = await axiosInstance.get(`/hotels/${hotelId}/rooms`);
  return response.data.data;
};
