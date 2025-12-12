import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toggleWishlist, checkWishlist } from "../../api/wishlistClient";
import "../../styles/components/search/HotelListCards.scss";

const HotelListCards = ({ hotels = [] }) => {
  const navigate = useNavigate();
  const { isAuthed } = useContext(AuthContext);
  const [wishlistStatus, setWishlistStatus] = useState({});

  // 초기 위시리스트 상태 확인
  useEffect(() => {
    if (!isAuthed || !hotels || hotels.length === 0) return;

    const checkWishlistStatus = async () => {
      const status = {};
      for (const hotel of hotels) {
        const hotelId = hotel.id || hotel._id;
        if (hotelId) {
          try {
            const isWishlisted = await checkWishlist(hotelId);
            status[hotelId] = isWishlisted;
          } catch (error) {
            console.error(`Failed to check wishlist for hotel ${hotelId}:`, error);
            status[hotelId] = false;
          }
        }
      }
      setWishlistStatus(status);
    };

    checkWishlistStatus();
  }, [hotels, isAuthed]);

  const handleWishlistToggle = async (e, hotelId) => {
    e.stopPropagation();
    
    if (!isAuthed) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    try {
      await toggleWishlist(hotelId);
      setWishlistStatus(prev => ({
        ...prev,
        [hotelId]: !prev[hotelId]
      }));
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      alert('위시리스트 처리 중 오류가 발생했습니다.');
    }
  };

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
        const isWishlisted = wishlistStatus[hotelId] || false;

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
                  className={`wishlist-button ${isWishlisted ? 'active' : ''}`}
                  onClick={(e) => handleWishlistToggle(e, hotelId)}
                  title={isWishlisted ? '위시리스트에서 제거' : '위시리스트에 추가'}
                >
                  {isWishlisted ? '❤️' : '🤍'}
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
