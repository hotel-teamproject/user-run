import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getMyReservations } from "../../api/reservationClient";
import "../../styles/pages/mypage/MyBookingsPage.scss";

const MyBookingsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("upcoming");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        const response = await getMyReservations();
        // 백엔드 응답 구조에 맞게 데이터 추출
        const data = response.data || response || [];
        setReservations(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch reservations:", err);
        setError("예약 내역을 불러오는데 실패했습니다.");
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  const filteredReservations = reservations.filter((reservation) => {
    const status = reservation.status || reservation.reservationStatus;
    const checkOutDate = new Date(reservation.checkOut || reservation.checkOutDate);
    const now = new Date();

    if (filter === "cancelled") {
      return status === "cancelled";
    } else if (filter === "upcoming") {
      // 취소되지 않고 체크아웃 날짜가 미래인 예약
      return status !== "cancelled" && checkOutDate >= now;
    } else if (filter === "past") {
      // 취소되지 않고 체크아웃 날짜가 과거인 예약
      return status !== "cancelled" && checkOutDate < now;
    }
    return true;
  });

  const handleDownloadTicket = (reservationId, e) => {
    if (e) {
      e.stopPropagation();
    }
    navigate(`/mypage/bookings/${reservationId}`);
  };

  if (loading) {
    return <div className="bookings-page loading">예약 내역을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="bookings-page error">{error}</div>;
  }

  return (
    <div className="bookings-page">
      {/* 예약내역 섹션 헤더 */}
      <div className="bookings-section-header">
        <div className="section-title-wrapper">
          <span className="book-icon">🛏️</span>
          <h3 className="section-title">예약내역</h3>
        </div>
        <div className="section-controls">
          <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="upcoming">예정된 예약</option>
            <option value="past">지난 예약</option>
            <option value="cancelled">취소된 예약</option>
          </select>
        </div>
      </div>

      {/* 예약 카드 리스트 */}
      <div className="reservations-list">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((reservation) => {
            // 백엔드 응답 구조에 맞게 데이터 매핑
            const reservationId = reservation._id || reservation.id;
            const hotel = reservation.hotel || {};
            const room = reservation.room || {};
            const checkIn = reservation.checkIn || reservation.checkInDate;
            const checkOut = reservation.checkOut || reservation.checkOutDate;

            // 날짜 포맷팅
            const formatDate = (dateString) => {
              if (!dateString) return "";
              const date = new Date(dateString);
              return date.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric"
              });
            };

            // 상태에 따른 한글 표시
            const getStatusText = (status) => {
              const statusMap = {
                pending: "대기 중",
                confirmed: "확정",
                cancelled: "취소됨",
                completed: "완료",
                "no-show": "노쇼"
              };
              return statusMap[status] || status;
            };

            // 숙박 일수 계산
            const calculateNights = () => {
              if (!checkIn || !checkOut) return 0;
              const checkInDate = new Date(checkIn);
              const checkOutDate = new Date(checkOut);
              const diffTime = checkOutDate - checkInDate;
              return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            };

            const nights = calculateNights();
            const totalPrice = reservation.totalPrice || 0;

            return (
              <div 
                key={reservationId} 
                className="reservation-card"
              >
                <div className="hotel-logo">
                  <img
                    src={hotel.image || hotel.images?.[0] || "/images/hotel.jpg"}
                    alt={hotel.name || "호텔"}
                    onError={(e) => {
                      e.target.src = "/images/hotel.jpg";
                    }}
                  />
                </div>
                <div className="reservation-info">
                  <div className="reservation-header">
                    <h4 className="hotel-name">{hotel.name || "호텔명 없음"}</h4>
                    <span className={`status-badge status-${reservation.status}`}>
                      {getStatusText(reservation.status)}
                    </span>
                  </div>
                  <div className="hotel-location">
                    {hotel.city || ""} {hotel.address || ""}
                  </div>
                  <div className="check-dates">
                    <div className="check-item">
                      <span className="check-label">체크인</span>
                      <span className="check-date">
                        {formatDate(checkIn)}
                      </span>
                      <div className="check-time">
                        <span className="time-icon">🕐</span>
                        <span>체크인 15:00</span>
                      </div>
                    </div>
                    <div className="check-item">
                      <span className="check-label">체크아웃</span>
                      <span className="check-date">
                        {formatDate(checkOut)}
                      </span>
                      <div className="check-time">
                        <span className="time-icon">🕐</span>
                        <span>체크아웃 11:00</span>
                      </div>
                    </div>
                  </div>
                  <div className="reservation-details">
                    <div className="room-number">
                      <span className="room-icon">🏢</span>
                      <span>{room.name || room.type || "객실 정보 없음"}</span>
                    </div>
                    <div className="guests-info">
                      <span className="guests-icon">👥</span>
                      <span>인원: {reservation.guests || 2}명</span>
                    </div>
                    <div className="nights-info">
                      <span className="nights-icon">🌙</span>
                      <span>숙박: {nights}박 {nights + 1}일</span>
                    </div>
                  </div>
                  <div className="price-action-row">
                    <div className="price-info">
                      <span className="price-label">총 결제 금액</span>
                      <span className="price-amount">₩{totalPrice.toLocaleString()}</span>
                    </div>
                    <button
                      className="download-button"
                      onClick={(e) => handleDownloadTicket(reservationId, e)}
                    >
                      상세보기
                      <span className="arrow-icon">→</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-reservations">
            예약 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
