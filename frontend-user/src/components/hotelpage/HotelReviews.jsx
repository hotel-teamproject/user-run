import React from "react";
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
 deleteReview,
 reviews = [],
 getReviews,
}) => {
 console.log("HotelReviews reviews:", reviews);
 return (
  <div className="hotel-reviews">
   <div className="dep">
    <h3>리뷰 ({reviewCount})</h3>
    <button className="btn btn--primary">리뷰 작성</button>
   </div>
   <div className="dep">
    <div className="average-rating">
     {renderStars(calculateAverageRating(reviews))}
     <span>{calculateAverageRating(reviews)}</span>
     <span>{getRatingLabel(calculateAverageRating(reviews))}</span>
    </div>
   </div>
   {/* 리뷰 컴포넌트 내용 작성 */}
   <ul className="review-list">
    {reviews && reviews.length > 0 ? (
     reviews.map((review) => (
      <li key={review.id}>
       <div className="profile-image">
        <img src="sample.jpg" alt={`${review.userId?.name || "익명"}`} />
       </div>
       <span className="review-author">{review.userId?.name || "익명"}</span>
       <span className="review-rating">{renderStars(review.rating)}</span>
       <span className="review-date">
        {new Date(review.createdAt || review.date).toLocaleDateString()}
       </span>
       {review.comment}
      </li>
     ))
    ) : (
     <li>리뷰가 없습니다.</li>
    )}
   </ul>
  </div>
 );
};

export default HotelReviews;
