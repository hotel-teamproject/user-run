import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { AuthContext } from "../../context/AuthContext";
import { getHotels } from "../../api/hotelClient";
import { toggleWishlist, checkWishlist } from "../../api/wishlistClient";
import { getRatingLabel } from "../../util/reviewHelper";
import "../../styles/components/home/RecommendedHotels.scss";

const RecommendedHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistStatus, setWishlistStatus] = useState({});
  const navigate = useNavigate();
  const { isAuthed } = useContext(AuthContext);

  useEffect(() => {
    const fetchRecommendedHotels = async () => {
      try {
        setLoading(true);
        // 평점 높은 순으로 정렬하여 추천 호텔 가져오기
        const data = await getHotels({ sort: "-rating" });
        // 상위 8개 가져오기 (슬라이더용)
        const recommended = Array.isArray(data) ? data.slice(0, 8) : [];
        setHotels(recommended);
      } catch (error) {
        console.error("Failed to fetch recommended hotels:", error);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedHotels();
  }, []);

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

  if (loading) {
    return (
      <div className="recommended-hotels">
        <div className="loading">추천 숙소를 불러오는 중...</div>
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return null;
  }

  return (
    <div className="recommended-hotels">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={false}
        watchOverflow={true}
        className="hotels-swiper"
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 16,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
        }}
      >
        {hotels.map((hotel) => {
          const hotelId = hotel.id || hotel._id;
          const price = hotel.basePrice ?? hotel.price ?? 0;
          const image = hotel.image || (hotel.images && hotel.images[0]) || '/images/hotel-placeholder.png';
          const isWishlisted = wishlistStatus[hotelId] || false;

          return (
            <SwiperSlide key={hotelId}>
              <div
                className="hotel-card"
                onClick={() => hotelId && navigate(`/hotels/${hotelId}`)}
              >
                <div className="hotel-image">
                  <img
                    src={image}
                    alt={hotel.name || 'Hotel'}
                    onError={(e) => {
                      e.target.src = '/images/hotel-placeholder.png';
                    }}
                  />
                </div>
                <div className="hotel-content">
                  <div className="hotel-header">
                    <div className="hotel-info">
                      <h3 className="hotel-name">{hotel.name}</h3>
                      
                      <div className="hotel-location">
                        {hotel.location || hotel.address || hotel.city || ''}
                      </div>

                      <div className="hotel-meta-row">
                        {hotel.stars && (
                          <span className="hotel-stars">
                            {Array.from({ length: hotel.stars }).map((_, idx) => (
                              <span key={idx}>★</span>
                            ))}{" "}
                            <span className="star-grade-text">{hotel.stars}성급</span>
                          </span>
                        )}
                        {hotel.amenities && (
                          <span className="hotel-amenities">
                            🏨 편의시설 {Array.isArray(hotel.amenities) ? hotel.amenities.length : hotel.amenities}개
                          </span>
                        )}
                      </div>

                      <div className="hotel-rating">
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
                      <div className="hotel-price">
                        <div className="price-label">시작가</div>
                        <div className="price-amount">
                          {Number(price).toLocaleString()}원/박
                        </div>
                        <div className="price-note">세금 별도</div>
                      </div>
                    )}
                  </div>

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
                      상세보기
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default RecommendedHotels;
