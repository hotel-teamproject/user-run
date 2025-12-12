/* ===========================================================
   리뷰 평점 계산 유틸리티
=========================================================== */

/**
 * 평균 평점 계산
 */
export const calculateAverageRating = (reviews = []) => {
  if (!reviews || reviews.length === 0) return "0.0";

  const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  return (total / reviews.length).toFixed(1);
};


/**
 * 평점 분포 계산
 */
export const getRatingDistribution = (reviews = []) => {
  const d = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) d[r.rating] += 1;
  });
  return d;
};


/**
 * 평점 라벨
 */
export const getRatingLabel = (rating) => {
  if (rating >= 4.5) return "Excellent";
  if (rating >= 4.0) return "Very Good";
  if (rating >= 3.5) return "Good";
  if (rating >= 3.0) return "Average";
  if (rating >= 2.0) return "Poor";
  return "Very Poor";
};


/**
 * ⭐ 평점 → 별 모양 HTML 변환 (예: ★★★★☆)
 */
export const renderStars = (rating = 0) => {
  const full = Math.floor(rating); // 완전 별
  const half = rating % 1 >= 0.5 ? 1 : 0; // 반 별
  const empty = 5 - full - half;

  return (
    "★".repeat(full) +
    (half ? "☆" : "") +
    "✩".repeat(empty)
  );
};


/**
 * 최신순 정렬
 */
export const sortReviewsByNewest = (reviews = []) => {
  return [...reviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
};


/**
 * 특정 평점만 필터링
 */
export const filterReviewsByRating = (reviews = [], rating) => {
  return reviews.filter((r) => r.rating === rating);
};
