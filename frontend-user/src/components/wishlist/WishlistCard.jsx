import React from "react";
import { useNavigate } from "react-router-dom";
import { getRatingLabel } from "../../util/reviewHelper";
import "../../styles/components/wishlist/WishlistCard.scss";

const WishlistCard = ({ hotel, onRemove }) => {
  const navigate = useNavigate();

  if (!hotel) return null;

  const price = hotel.basePrice ?? hotel.price ?? 0;

  const handleRemoveWishlist = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove(hotel.id);
  };

  return (
    <div className="wishlist-card" onClick={() => navigate(`/hotels/${hotel.id}`)}>
      <div className="wishlist-card__image">
        <img src={hotel.image || "/images/hotel-placeholder.png"} alt={hotel.name} />
        {hotel.imageCount && <div className="image-count">{hotel.imageCount} images</div>}
      </div>

      <div className="wishlist-card__content">
        <div className="wishlist-card__header">
          <div className="wishlist-card__info">
            <h3 className="hotel-name">{hotel.name}</h3>
            <div className="hotel-location">위치: {hotel.location}</div>

            <div className="hotel-meta">
              {hotel.stars && (
                <span className="hotel-stars">
                  {Array.from({ length: hotel.stars }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}{" "}
                  <span className="star-grade-text">{hotel.stars}성급</span>
                </span>
              )}
              {hotel.amenities && <span className="hotel-amenities">편의시설 {hotel.amenities}개</span>}
            </div>

            {hotel.rating && (
              <div className="hotel-rating">
                <span className="rating-score">{hotel.rating}</span>
                <span className="rating-label">{hotel.ratingLabel || getRatingLabel(hotel.rating)}</span>
                {hotel.reviews && <span className="rating-reviews">{hotel.reviews}건의 후기</span>}
              </div>
            )}
          </div>

          <div className="wishlist-card__price">
            <div className="price-label">시작가</div>
            <div className="price-amount">{Number(price).toLocaleString()}원/박</div>
            <div className="price-note">세금 별도</div>
          </div>
        </div>

        <div className="wishlist-card__footer">
          <button className="remove-wishlist-button" onClick={handleRemoveWishlist}>
            찜 해제
          </button>

          <button
            className="view-button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/hotels/${hotel.id}`);
            }}
          >
            상세 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;


