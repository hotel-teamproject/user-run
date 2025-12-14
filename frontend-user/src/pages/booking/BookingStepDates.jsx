import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../../styles/pages/booking/BookingStep.scss";
import { getHotelDetail } from "../../api/hotelClient";

const BookingStepDates = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const location = useLocation();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const qs = new URLSearchParams(location.search);
  const initialCheckIn = qs.get("checkIn") ? new Date(qs.get("checkIn")) : null;
  const initialCheckOut = qs.get("checkOut") ? new Date(qs.get("checkOut")) : null;
  const initialGuests = qs.get("guests") ? Number(qs.get("guests")) : 2;

  const formatDateInput = (d) => (d ? d.toISOString().slice(0, 10) : "");

  const [checkIn, setCheckIn] = useState(formatDateInput(initialCheckIn));
  const [checkOut, setCheckOut] = useState(formatDateInput(initialCheckOut));
  const [guests, setGuests] = useState(initialGuests);

  useEffect(() => {
    const fetchHotel = async () => {
      if (!hotelId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const hotelData = await getHotelDetail(hotelId);
        setHotel(hotelData);
      } catch (err) {
        console.error("Failed to load hotel:", err);
        alert("호텔 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [hotelId]);

  useEffect(() => {
    if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
      setCheckOut("");
    }
  }, [checkIn, checkOut]);

  const handleNext = () => {
    if (!checkIn || !checkOut) {
      alert("체크인/체크아웃 날짜를 선택해 주세요.");
      return;
    }

    const params = new URLSearchParams();
    params.set("checkIn", new Date(checkIn).toISOString());
    params.set("checkOut", new Date(checkOut).toISOString());
    params.set("guests", String(guests));

    navigate(`/booking/${hotelId}/room?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="booking-page inner">
        <div className="loading">호텔 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="booking-page inner">
        <div className="error">호텔을 찾을 수 없습니다.</div>
      </div>
    );
  }

  // 호텔 데이터 변환
  const hotelDisplay = {
    name: hotel.name,
    city: hotel.city,
    location: hotel.address || "",
    ratingAverage: hotel.rating || 0,
    ratingCount: hotel.reviewCount || 0,
    images: hotel.images || [],
    basePrice: hotel.rooms?.[0]?.price || 100000,
  };

  return (
    <div className="booking-page inner">
      <h2 className="booking-title">예약하기</h2>

      <div className="booking-grid">
        
        {/* =========================
            LEFT FORM
        ========================= */}
        <div className="booking-left">
          <div className="booking-panel">
            <label>
              체크인 날짜
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </label>

            <label>
              체크아웃 날짜
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </label>

            <label>
              인원수
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n}명
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="booking-buttons">
            <button className="btn-secondary" onClick={() => navigate(-1)}>
              취소
            </button>
            <button className="booking-btn-primary" onClick={handleNext}>
              객실 선택하기
            </button>
          </div>
        </div>

        {/* =========================
            RIGHT HOTEL SUMMARY
        ========================= */}
        <aside className="booking-right">
          <div className="hotel-summary">
            <div className="hotel-header">
              <div className="hotel-image">
                <img 
                  src={hotelDisplay.images[0] || "/images/hotel.jpg"} 
                  alt={hotelDisplay.name}
                  onError={(e) => {
                    e.target.src = "/images/hotel.jpg";
                  }}
                />
              </div>
              <div className="hotel-info">
                <h3>{hotelDisplay.name}</h3>
                <p className="hotel-location">
                  {hotelDisplay.city} • {hotelDisplay.location}
                </p>
                <div className="hotel-rating">
                  ⭐ {hotelDisplay.ratingAverage.toFixed(1)} • 리뷰 {hotelDisplay.ratingCount}개
                </div>
              </div>
            </div>

            <div className="booking-details">
              <div className="detail-row">
                <span>체크인</span>
                <span>{checkIn ? new Date(checkIn).toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric' }) : "날짜 선택"}</span>
              </div>
              <div className="detail-row">
                <span>체크아웃</span>
                <span>{checkOut ? new Date(checkOut).toLocaleDateString("ko-KR", { year: 'numeric', month: 'long', day: 'numeric' }) : "날짜 선택"}</span>
              </div>
              <div className="detail-row">
                <span>인원</span>
                <span>{guests}명</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default BookingStepDates;
