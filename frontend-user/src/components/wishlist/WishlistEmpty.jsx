import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/wishlist/WishlistEmpty.scss";

const WishlistEmpty = () => {
  const navigate = useNavigate();

  return (
    <div className="wishlist-empty">
      <div className="wishlist-empty__icon">♡</div>
      <h2 className="wishlist-empty__title">찜한 숙소가 없습니다</h2>
      <p className="wishlist-empty__description">
        좋아하는 숙소를 찜해보세요. 찜한 숙소는 여기에서 확인할 수 있습니다.
      </p>
      <button
        className="wishlist-empty__button"
        onClick={() => navigate("/search")}
      >
        숙소 둘러보기
      </button>
    </div>
  );
};

export default WishlistEmpty;
