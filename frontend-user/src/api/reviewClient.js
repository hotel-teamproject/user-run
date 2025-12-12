import axiosInstance from "./axiosConfig";

// 예시: 작성 후 24시간 이내만 수정/삭제 가능
const canEditOrDelete = (review) => {
  const hoursSinceCreated = (Date.now() - new Date(review.createdAt)) / (1000 * 60 * 60);
  return hoursSinceCreated < 24;
};

export const getReviews = async (hotelId) => {
  const response = await axiosInstance.get(`/reviews/hotels/${hotelId}`);
  return response.data.data?.reviews || response.data.data || [];
}


export const createReview = async (reviewData) => {
  const response = await axiosInstance.post(`/reviews`, reviewData);
  return response.data.data;
}
export const updateReview = async (reviewId, reviewData) => {
  const response = await axiosInstance.put(`/reviews/${reviewId}`, reviewData);
  canEditOrDelete(response.data.data);
  return response.data.data;
} 
export const deleteReview = async (reviewId) => {
  const response = await axiosInstance.delete(`/reviews/${reviewId}`);
  canEditOrDelete(response.data.data);
  return response.data.data;
}
