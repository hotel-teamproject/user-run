import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/search/HotelListCards.scss";

const HotelListCards = ({ hotels = [] }) => {
  const navigate = useNavigate();

  if (!hotels || hotels.length === 0) {
    return (
      <div className="hotel-list-cards empty">호텔을 찾을 수 없습니다.</div>
    );
  }

  return (
    <div className="hotel-list-cards">
      {hotels.map((hotel, i) => {
        const price = hotel.basePrice ?? hotel.price ?? 0;
        const hotelId = hotel.id || hotel._id;

        return (
          <div
            key={hotelId || i}
            className="hotel-card"
            onClick={() => hotelId && navigate(`/hotels/${hotelId}`)}
          >
            {/* ========== LEFT IMAGE (꽉 채우기) ========== */}
            <div className="hotel-image">
              <img 
                src={hotel.image || (hotel.images && hotel.images[0]) || '/images/hotel-placeholder.png'} 
                alt={hotel.name || 'Hotel'} 
                onError={(e) => {
                  e.target.src = '/images/hotel-placeholder.png';
                }}
              />
              {(hotel.imageCount || (hotel.images && hotel.images.length)) && (
                <div className="image-count">
                  {hotel.imageCount || hotel.images?.length || 0} images
                </div>
              )}
            </div>

            {/* ========== RIGHT CONTENT ========== */}
            <div className="hotel-content">

              {/* -------- TOP TEXT + PRICE -------- */}
              <div className="hotel-header">
                <div className="hotel-info">
                  <h3 className="hotel-name">{hotel.name}</h3>
                  <div className="hotel-location">{hotel.location || hotel.address || hotel.city || ''}</div>

                  <div className="hotel-meta">
                    {hotel.stars && (
                      <span className="hotel-stars">
                        {"⭐".repeat(hotel.stars)} {hotel.stars} Star Hotel
                      </span>
                    )}
                    {hotel.amenities && (
                      <span className="hotel-amenities">
                        🏨 {Array.isArray(hotel.amenities) ? hotel.amenities.length : hotel.amenities}+ Amenities
                      </span>
                    )}
                  </div>

                  <div className="hotel-rating">
                    <span className="rating-score">{hotel.rating || hotel.ratingAverage || 0}</span>
                    <span className="rating-label">{hotel.ratingLabel || "평점"}</span>
                    <span className="rating-reviews">
                      {hotel.reviewCount || hotel.reviews || 0} reviews
                    </span>
                  </div>
                </div>

                {price > 0 && (
                  <div className="hotel-price">
                    <div className="price-label">starting from</div>
                    <div className="price-amount">
                      ₩{Number(price).toLocaleString()}/night
                    </div>
                    <div className="price-note">excl. tax</div>
                  </div>
                )}
              </div>

              {/* -------- BOTTOM BUTTONS -------- */}
              <div className="hotel-footer">
                <button
                  className="wishlist-button"
                  onClick={(e) => e.stopPropagation()}
                >
                  ❤️
                </button>

                <button
                  className="view-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hotelId) {
                      navigate(`/hotels/${hotelId}`);
                    }
                  }}
                >
                  View Place
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HotelListCards;
