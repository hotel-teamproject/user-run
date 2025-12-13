import React, { useState, useContext } from "react";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { deleteReview } from "../../api/reviewClient";
import ReviewWriteModal from "./ReviewWriteModal";
import "../../styles/components/hotelpage/HotelReviews.scss";
import {
 renderStars,
 getRatingLabel,
 getRatingDistribution,
 calculateAverageRating,
} from "../../util/reviewHelper";

const HotelReviews = ({
 hotelId,
 rating,
 reviewCount,
 createReview,
 updateReview,
 reviews = [],
 getReviews,
}) => {
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [editingReview, setEditingReview] = useState(null);
 const [deletingReviewId, setDeletingReviewId] = useState(null);
 const { user } = useContext(AuthContext);
 
 console.log("HotelReviews reviews:", reviews);
 
 const averageRating = calculateAverageRating(reviews);
 const ratingLabel = getRatingLabel(averageRating);
 
 // 실제 리뷰 개수 (reviews 배열의 길이를 우선 사용)
 const actualReviewCount = reviews && reviews.length > 0 ? reviews.length : (reviewCount || 0);
 
 // 날짜 포맷팅 함수
 const formatDate = (dateString) => {
   const date = new Date(dateString);
   return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
 };
 
 // 별점 렌더링 함수 (FaStar 사용)
 const renderStarRating = (rating) => {
   const stars = [];
   const fullStars = Math.floor(rating);
   for (let i = 0; i < 5; i++) {
     stars.push(
       <FaStar 
         key={i} 
         className={i < fullStars ? "star-filled" : "star-empty"} 
       />
     );
   }
   return stars;
 };
 
 const handleReviewSubmitted = () => {
   setEditingReview(null);
   if (getReviews) {
     getReviews();
   } else {
     window.location.reload();
   }
 };

 const handleEditReview = (review) => {
   setEditingReview(review);
   setIsModalOpen(true);
 };

 const handleDeleteReview = async (reviewId) => {
   if (!window.confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
     return;
   }

   try {
     setDeletingReviewId(reviewId);
     console.log("리뷰 삭제 시도:", reviewId);
     
     const result = await deleteReview(reviewId);
     console.log("리뷰 삭제 성공:", result);
     
     // 삭제 성공 후 리뷰 목록 새로고침
     if (getReviews) {
       await getReviews();
     } else {
       window.location.reload();
     }
   } catch (err) {
     console.error("리뷰 삭제 실패:", err);
     console.error("에러 상세:", {
       message: err.message,
       response: err.response?.data,
       status: err.response?.status
     });
     
     const errorMessage = err.response?.data?.message || 
                         err.response?.data?.error || 
                         err.message || 
                         "리뷰 삭제에 실패했습니다.";
     alert(errorMessage);
   } finally {
     setDeletingReviewId(null);
   }
 };

 // 현재 사용자가 리뷰 작성자인지 확인
 const isOwnReview = (review) => {
   if (!user) return false;
   const reviewUserId = review.user?._id || review.userId?._id || review.user || review.userId;
   const currentUserId = user._id || user.id;
   return reviewUserId?.toString() === currentUserId?.toString();
 };

 // 현재 사용자가 이미 이 호텔에 리뷰를 작성했는지 확인
 const hasUserReviewed = () => {
   if (!user || !reviews || reviews.length === 0) return false;
   const currentUserId = user._id || user.id;
   return reviews.some((review) => {
     const reviewUserId = review.user?._id || review.userId?._id || review.user || review.userId;
     return reviewUserId?.toString() === currentUserId?.toString();
   });
 };

 // 현재 사용자의 리뷰 찾기
 const getUserReview = () => {
   if (!user || !reviews || reviews.length === 0) return null;
   const currentUserId = user._id || user.id;
   return reviews.find((review) => {
     const reviewUserId = review.user?._id || review.userId?._id || review.user || review.userId;
     return reviewUserId?.toString() === currentUserId?.toString();
   });
 };
 
 const userHasReviewed = hasUserReviewed();
 const userReview = getUserReview();

 return (
  <div className="hotel-reviews">
   <div className="reviews-header">
    <h3>리뷰 ({actualReviewCount})</h3>
    {user ? (
     userHasReviewed ? (
      <button 
       className="btn btn--secondary" 
       onClick={() => handleEditReview(userReview)}
       title="리뷰 수정"
      >
       내 리뷰 수정
      </button>
     ) : (
      <button 
       className="btn btn--primary" 
       onClick={() => setIsModalOpen(true)}
      >
       리뷰 작성
      </button>
     )
    ) : (
     <button 
      className="btn btn--primary" 
      disabled
      title="로그인이 필요합니다"
     >
       리뷰 작성
     </button>
    )}
   </div>
   
   <ReviewWriteModal
    isOpen={isModalOpen}
    onClose={() => {
      setIsModalOpen(false);
      setEditingReview(null);
    }}
    hotelId={hotelId}
    onReviewSubmitted={handleReviewSubmitted}
    editReview={editingReview}
   />
   
   <div className="average-rating-section">
    <div className="average-rating">
     {renderStarRating(parseFloat(averageRating))}
     <span className="rating-value">{averageRating}</span>
     <span className="rating-label">{ratingLabel}</span>
    </div>
   </div>
   
   <ul className="review-list">
    {reviews && reviews.length > 0 ? (
     reviews.map((review) => {
      const isOwn = isOwnReview(review);
      const reviewId = review.id || review._id;
      
      return (
       <li key={reviewId} className="review-item">
        <div className="review-content">
         <div className="review-header-info">
          <div className="profile-image">
           <img 
            src={review.userId?.profileImage || review.user?.profileImage || "/images/default-avatar.png"} 
            alt={review.userId?.name || review.user?.name || "익명"} 
           />
          </div>
          <div className="review-meta">
           <span className="review-author">{review.userId?.name || review.user?.name || "익명"}</span>
           <div className="review-rating-date">
            <span className="review-rating">{renderStarRating(review.rating)}</span>
            <span className="review-date">
             {formatDate(review.createdAt || review.date)}
            </span>
           </div>
          </div>
          {isOwn && (
           <div className="review-actions">
            <button
             className="btn-edit"
             onClick={() => handleEditReview(review)}
             title="리뷰 수정"
            >
             <FaEdit />
            </button>
            <button
             className="btn-delete"
             onClick={() => handleDeleteReview(reviewId)}
             disabled={deletingReviewId === reviewId}
             title="리뷰 삭제"
            >
             <FaTrash />
            </button>
           </div>
          )}
         </div>
         <p className="review-text">{review.comment || review.content}</p>
        </div>
       </li>
      );
     })
    ) : (
     <li className="no-reviews">리뷰가 없습니다.</li>
    )}
   </ul>
  </div>
 );
};

export default HotelReviews;
