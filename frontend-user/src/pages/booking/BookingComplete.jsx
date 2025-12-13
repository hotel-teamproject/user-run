import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getReservationDetail } from "../../api/reservationClient";
import "../../styles/pages/booking/BookingStep.scss";

const BookingComplete = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const location = useLocation();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  const qs = new URLSearchParams(location.search);
  const reservationId = qs.get("reservationId");

  useEffect(() => {
    const fetchReservation = async () => {
      if (!reservationId) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const response = await getReservationDetail(reservationId);
        if (response.resultCode === "SUCCESS") {
          setReservation(response.data);
        } else {
          alert("예약 정보를 불러오는데 실패했습니다.");
          navigate("/");
        }
      } catch (err) {
        console.error("Failed to load reservation:", err);
        alert("예약 정보를 불러오는데 실패했습니다.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [reservationId, navigate]);

  if (loading) {
    return (
      <div className="booking-page inner">
        <div className="loading">예약 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="booking-page inner">
        <div className="error">예약 정보를 찾을 수 없습니다.</div>
      </div>
    );
  }

  const checkInDate = new Date(reservation.checkIn);
  const checkOutDate = new Date(reservation.checkOut);
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="booking-page inner">
      <div className="booking-complete">
        <div className="complete-icon">✅</div>
        <h2 className="complete-title">예약이 완료되었습니다!</h2>
        <p className="complete-message">
          예약이 성공적으로 완료되었습니다. 예약 상세 정보는 이메일로 발송되었습니다.
        </p>

        <div className="reservation-summary">
          <div className="summary-card">
            <h3>예약 정보</h3>
            <div className="summary-details">
              <div className="detail-item">
                <span className="label">예약 번호</span>
                <span className="value">{reservation._id}</span>
              </div>
              <div className="detail-item">
                <span className="label">호텔명</span>
                <span className="value">
                  {reservation.hotel?.name || reservation.hotelId}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">객실</span>
                <span className="value">
                  {reservation.room?.name || reservation.roomId}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">체크인</span>
                <span className="value">
                  {checkInDate.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">체크아웃</span>
                <span className="value">
                  {checkOutDate.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">숙박</span>
                <span className="value">{nights}박</span>
              </div>
              <div className="detail-item">
                <span className="label">인원</span>
                <span className="value">{reservation.guests}명</span>
              </div>
              {reservation.extrasPrice > 0 && (
                <div className="detail-item">
                  <span className="label">추가 옵션</span>
                  <span className="value">+₩{reservation.extrasPrice.toLocaleString()}</span>
                </div>
              )}
              {reservation.discount > 0 && (
                <div className="detail-item">
                  <span className="label">쿠폰 할인</span>
                  <span className="value" style={{ color: '#10b981' }}>
                    -₩{reservation.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="detail-item">
                <span className="label">결제 금액</span>
                <span className="value amount">
                  ₩{reservation.totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">예약 상태</span>
                <span className="value status">
                  {reservation.status === "pending"
                    ? "대기 중"
                    : reservation.status === "confirmed"
                    ? "확정"
                    : reservation.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="complete-actions">
          <button
            className="booking-btn-primary"
            onClick={() => navigate("/mypage/bookings")}
          >
            내 예약 보기
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            홈으로 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingComplete;
