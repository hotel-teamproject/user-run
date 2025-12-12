import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMyReservations } from "../../api/reservationClient";
import "../../styles/pages/mypage/MyBookingsPage.scss";

const MyBookingsPage = () => {
  const { user } = useContext(AuthContext);
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
    // 백엔드 응답 구조에 맞게 status 필드 확인
    const status = reservation.status || reservation.reservationStatus;
    return status === filter;
  });

  const handleDownloadTicket = (reservationId) => {
    console.log("Download ticket for reservation:", reservationId);
    // TODO: 티켓 다운로드 기능 구현
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
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="cancelled">Cancelled</option>
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

            return (
              <div key={reservationId} className="reservation-card">
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
                  <h4 className="hotel-name">{hotel.name || "호텔명 없음"}</h4>
                  <div className="check-dates">
                    <div className="check-item">
                      <span className="check-label">Check-In</span>
                      <span className="check-date">
                        {formatDate(checkIn)}
                      </span>
                      <div className="check-time">
                        <span className="time-icon">🕐</span>
                        <span>체크인 15:00</span>
                      </div>
                    </div>
                    <div className="check-item">
                      <span className="check-label">Check Out</span>
                      <span className="check-date">
                        {formatDate(checkOut)}
                      </span>
                      <div className="check-time">
                        <span className="time-icon">🕐</span>
                        <span>체크아웃 11:00</span>
                      </div>
                    </div>
                  </div>
                  <div className="room-number">
                    <span className="room-icon">🏢</span>
                    <span>{room.name || room.type || "객실 정보 없음"}</span>
                  </div>
                </div>
                <button
                  className="download-button"
                  onClick={() => handleDownloadTicket(reservationId)}
                >
                  Download Ticket
                  <span className="arrow-icon">→</span>
                </button>
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
