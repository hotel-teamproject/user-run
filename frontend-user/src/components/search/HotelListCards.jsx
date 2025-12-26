import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toggleWishlist, checkWishlist } from "../../api/wishlistClient";
import { getRatingLabel } from "../../util/reviewHelper";
import "../../styles/components/search/HotelListCards.scss";

const HotelListCards = ({ hotels = [], filters = {} }) => {
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
            className="hotel-list-card"
            onClick={() => {
              if (hotelId) {
                // 검색 페이지에서 선택한 날짜 정보를 URL 파라미터로 전달
                const params = new URLSearchParams();
                if (filters.checkIn) params.set("checkIn", filters.checkIn);
                if (filters.checkOut) params.set("checkOut", filters.checkOut);
                if (filters.guests) params.set("guests", typeof filters.guests === 'object' ? filters.guests.guests : filters.guests);
                const queryString = params.toString();
                navigate(`/hotels/${hotelId}${queryString ? `?${queryString}` : ''}`);
              }
            }}
          >
            {/* ========== LEFT IMAGE (꽉 채우기) ========== */}
            <div className="hotel-list-image">
              <img 
                src={hotel.image || (hotel.images && hotel.images[0]) || '/images/hotel-placeholder.png'} 
                alt={hotel.name || 'Hotel'} 
                onError={(e) => {
                  e.target.src = '/images/hotel-placeholder.png';
                }}
              />
              {(hotel.imageCount || (hotel.images && hotel.images.length)) && (
                <div className="image-count">
                  사진 {hotel.imageCount || hotel.images?.length || 0}장
                </div>
              )}
            </div>

            {/* ========== RIGHT CONTENT ========== */}
            <div className="hotel-list-content">

              {/* -------- TOP TEXT + PRICE -------- */}
              <div className="hotel-list-header">
                <div className="hotel-list-info">
                  <h3 className="hotel-list-name">{hotel.name}</h3>
                  
                  <div className="hotel-list-location">{hotel.location || hotel.address || hotel.city || ''}</div>

                  <div className="hotel-list-meta-row">
                    {hotel.stars && (
                      <span className="hotel-list-stars">
                        {Array.from({ length: hotel.stars }).map((_, idx) => (
                          <span key={idx}>★</span>
                        ))}{" "}
                        <span className="star-grade-text">{hotel.stars}성급</span>
                      </span>
                    )}
                    {hotel.amenities && (
                      <span className="hotel-list-amenities">
                        🏨 편의시설 {Array.isArray(hotel.amenities) ? hotel.amenities.length : hotel.amenities}개
                      </span>
                    )}
                  </div>

                  <div className="hotel-list-rating">
                    <span className="rating-score">{hotel.rating || hotel.ratingAverage || 0}</span>
                    <span className="rating-label">
                      {getRatingLabel(parseFloat(hotel.rating || hotel.ratingAverage || 0))}
                    </span>
                    <span className="rating-reviews">
                      리뷰 {hotel.reviewCount || hotel.reviews || 0}개
                    </span>
                  </div>
                </div>
                
                {price > 0 && (
                  <div className="hotel-list-price">
                    <div className="price-label">시작가</div>
                    <div className="price-amount">
                      {Number(price).toLocaleString()}원/박
                    </div>
                    <div className="price-note">세금 별도</div>
                  </div>
                )}
              </div>

              {/* -------- BOTTOM BUTTONS -------- */}
              <div className="hotel-list-footer">
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
                      // 검색 페이지에서 선택한 날짜 정보를 URL 파라미터로 전달
                      const params = new URLSearchParams();
                      if (filters.checkIn) params.set("checkIn", filters.checkIn);
                      if (filters.checkOut) params.set("checkOut", filters.checkOut);
                      if (filters.guests) params.set("guests", typeof filters.guests === 'object' ? filters.guests.guests : filters.guests);
                      const queryString = params.toString();
                      navigate(`/hotels/${hotelId}${queryString ? `?${queryString}` : ''}`);
                    }
                  }}
                >
                  상세보기
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
