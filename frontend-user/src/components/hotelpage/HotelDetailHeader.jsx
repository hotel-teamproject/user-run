import React, { useState } from "react";
import { FaStar, FaMapMarkerAlt, FaHeart, FaShare } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { getRatingLabel } from "../../util/reviewHelper";
import HotelGalleryModal from "./HotelGalleryModal";
import "../../styles/components/hotelpage/HotelDetailHeader.scss";

const HotelDetailHeader = ({ hotel }) => {
 // console.log("HotelDetailHeader props:", hotel);

 const navigate = useNavigate();
 const routerLocation = useLocation();
 const [dateRange, setDateRange] = useState([null, null]);
 const [startDate, endDate] = dateRange;
 const [guests, setGuests] = useState(2);
 const [isGalleryOpen, setIsGalleryOpen] = useState(false);
 const [selectedImageIndex, setSelectedImageIndex] = useState(0);
 const [shareMessage, setShareMessage] = useState("");
 if (!hotel) {
  return <div className="hotel-detail-header loading">로딩 중...</div>;
 }

 const {
  name = "호텔명 없음",
  rating = 0,
  ratingAverage = 0, // 호환성을 위해 유지
  reviewCount = 0,
  ratingCount = 0, // 호환성을 위해 유지
  stars = 0,
  city = "",
  address = "주소 정보 없음",
  location = "",
  basePrice = 0,
  price = 0, // 호환성을 위해 유지
  images = [],
 } = hotel;

 // 실제 rating 값 (ratingAverage가 있으면 우선 사용, 없으면 rating 사용)
 const actualRating = ratingAverage || rating || 0;
 // 실제 reviewCount 값
 const actualReviewCount = reviewCount || ratingCount || 0;


 // 별점을 별 아이콘으로 표시 (stars 값 사용)
 const renderStars = (starCount) => {
  const stars = [];
  const fullStars = Math.floor(starCount || 0);

  for (let i = 0; i < 5; i++) {
   stars.push(
    <FaStar key={i} className={i < fullStars ? "star-filled" : "star-empty"} />
   );
  }
  return stars;
 };

 const handleFavorite = () => {
  console.log("Add to favorites");
 };

 const handleShare = async () => {
  const hotelId = hotel._id || hotel.id;
  const currentUrl = `${window.location.origin}${routerLocation.pathname}`;
  const shareText = `${name} - STAYBOOK에서 확인하기`;
  
  // Web Share API 지원 여부 확인 (모바일 및 일부 데스크톱 브라우저)
  if (navigator.share) {
    try {
      await navigator.share({
        title: name,
        text: shareText,
        url: currentUrl,
      });
    } catch (error) {
      // 사용자가 공유를 취소한 경우는 에러로 처리하지 않음
      if (error.name !== 'AbortError') {
        console.error('공유 실패:', error);
        // Web Share API 실패 시 클립보드 복사로 대체
        copyToClipboard(currentUrl);
      }
    }
  } else {
    // Web Share API를 지원하지 않는 경우 클립보드에 복사
    copyToClipboard(currentUrl);
  }
 };

 const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    setShareMessage("링크가 클립보드에 복사되었습니다!");
    setTimeout(() => {
      setShareMessage("");
    }, 3000);
  } catch (error) {
    console.error('클립보드 복사 실패:', error);
    // 클립보드 API를 지원하지 않는 경우 fallback
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setShareMessage("링크가 클립보드에 복사되었습니다!");
      setTimeout(() => {
        setShareMessage("");
      }, 3000);
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert(`호텔 링크: ${text}`);
    }
    document.body.removeChild(textArea);
  }
 };

 const handleBookNow = () => {
  const params = new URLSearchParams();
  if (startDate) params.append("checkIn", startDate.toISOString());
  if (endDate) params.append("checkOut", endDate.toISOString());
  params.append("guests", guests);

  navigate(`/booking/${hotel._id || hotel.id}?${params.toString()}`);
 };

 const handleImageClick = (index) => {
  setSelectedImageIndex(index);
  setIsGalleryOpen(true);
 };

 const handleCloseGallery = () => {
  setIsGalleryOpen(false);
 };

 return (
  <div className="hotel-detail-header">
   <div className="header-top">
    <div className="breadcrumb">
     <span>{city || "위치"}</span> &gt; <span>{location || "지역"}</span>{" "}
     &gt; <span>{name}</span>
    </div>
    <div className="header-actions">
     <button className="icon-btn" onClick={handleFavorite}>
      <FaHeart />
     </button>
     <button className="icon-btn" onClick={handleShare} title="공유하기">
      <FaShare />
     </button>
     {shareMessage && (
       <div className="share-message">{shareMessage}</div>
     )}
    </div>
   </div>

   <div className="hotel-info">
    <div className="hotel-title-section">
     <h1 className="hotel-name">{name}</h1>
     {stars > 0 && (
     <div className="rating-section">
       <div className="stars">{renderStars(stars)}</div>
       <span className="rating-text">{stars}성급 호텔</span>
     </div>
     )}
     <div className="location-section">
      <FaMapMarkerAlt className="location-icon" />
      <span className="address">{address || location || city || "주소 정보 없음"}</span>
     </div>
     {actualRating > 0 && (
     <div className="review-section">
       <span className="review-score">{actualRating.toFixed(1)}</span>
       <span className="review-text">{getRatingLabel(actualRating)}</span>
       {actualReviewCount > 0 && (
        <span className="review-count">리뷰 {actualReviewCount}개</span>
       )}
     </div>
     )}
    </div>
    <div className="price-section">
     <div className="hotel-price">
      <div className="price-label">시작가</div>
      <div className="price-amount">
       {((basePrice || price || 0)).toLocaleString()}원/박
      </div>
      <div className="price-note">세금 별도</div>
     </div>
     <button className="btn-book-now" onClick={handleBookNow}>
      지금 예약하기
     </button>
    </div>
   </div>

   <div className="hotel-images">
    <div className="main-image" onClick={() => handleImageClick(0)}>
     <img
      src={
       images[0] ||
       "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"
      }
      alt={name}
     />
    </div>
    <div className="sub-images">
     {images.slice(1, 5).map((img, index) => (
      <div 
       key={index} 
       className="sub-image" 
       onClick={() => handleImageClick(index + 1)}
      >
       <img src={img} alt={`${name} ${index + 2}`} />
       {index === 3 && images.length > 5 && (
        <div className="view-all-overlay">
         <span>모든 사진 보기</span>
        </div>
       )}
      </div>
     ))}
    </div>
   </div>

   <HotelGalleryModal
    images={images.length > 0 ? images : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"]}
    currentIndex={selectedImageIndex}
    isOpen={isGalleryOpen}
    onClose={handleCloseGallery}
   />
  </div>
 );
};

export default HotelDetailHeader;
