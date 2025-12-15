import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import WishlistCard from "../../components/wishlist/WishlistCard";
import WishlistEmpty from "../../components/wishlist/WishlistEmpty";
import { getMyWishlist, toggleWishlist } from "../../api/wishlistClient";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/pages/mypage/WishlistPage.scss";

const WishlistPage = () => {
  const [wishlistHotels, setWishlistHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const wishlist = await getMyWishlist();
        
        // 백엔드 응답 구조에 맞게 변환
        const formattedWishlist = wishlist.map((item) => {
          const hotel = item.hotel || item;
          const rating = hotel.rating || 0;

          let ratingLabel = "";
          if (rating >= 4.5) {
            ratingLabel = "최고";
          } else if (rating >= 4.0) {
            ratingLabel = "매우 좋음";
          } else if (rating > 0) {
            ratingLabel = "좋음";
          } else {
            ratingLabel = "";
          }

          return {
            id: hotel._id || hotel.id,
            name: hotel.name,
            location: hotel.city || hotel.address?.city || "",
            image: hotel.images?.[0] || hotel.image || "/images/hotel.jpg",
            imageCount: hotel.images?.length || 0,
            stars: Math.round(rating || 0),
            amenities: hotel.amenities?.length || 0,
            rating,
            ratingLabel,
            reviews: hotel.reviewCount || 0,
            basePrice: hotel.rooms?.[0]?.price || 100000,
          };
        });

        setWishlistHotels(formattedWishlist);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        setError("위시리스트를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, [user, navigate]);

  const handleRemoveWishlist = async (hotelId) => {
    try {
      await toggleWishlist(hotelId);
      // 위시리스트에서 제거
      setWishlistHotels((prev) => prev.filter((hotel) => hotel.id !== hotelId));
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
      alert("위시리스트에서 제거하는데 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__loading">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-page__error">{error}</div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-page__header">
        <h1 className="wishlist-page__title">찜 목록</h1>
        <p className="wishlist-page__subtitle">찜한 숙소 {wishlistHotels.length}개</p>
      </div>

      <div className="wishlist-page__content">
        {wishlistHotels.length === 0 ? (
          <WishlistEmpty />
        ) : (
          <div className="wishlist-page__list">
            {wishlistHotels.map((hotel) => (
              <WishlistCard key={hotel.id} hotel={hotel} onRemove={handleRemoveWishlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
