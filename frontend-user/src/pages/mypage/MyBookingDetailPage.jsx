import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReservationDetail, cancelReservation } from "../../api/reservationClient";
import "../../styles/pages/mypage/MyBookingDetailPage.scss";

const MyBookingDetailPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const fetchReservation = async () => {
      if (!bookingId) {
        setError("예약 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getReservationDetail(bookingId);
        
        if (response.resultCode === "SUCCESS") {
          setReservation(response.data);
        } else {
          setError(response.message || "예약 정보를 불러오는데 실패했습니다.");
        }
      } catch (err) {
        console.error("Failed to load reservation:", err);
        setError(err.response?.data?.message || "예약 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservation();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="booking-detail-page">
        <div className="loading">예약 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="booking-detail-page">
        <div className="error">{error || "예약 정보를 찾을 수 없습니다."}</div>
        <button className="btn-back" onClick={() => navigate("/mypage/bookings")}>
          예약 목록으로 돌아가기
        </button>
      </div>
    );
  }

  const hotel = reservation.hotel || {};
  const room = reservation.room || {};
  const payment = reservation.payment || {};
  
  const checkInDate = new Date(reservation.checkIn || reservation.checkInDate);
  const checkOutDate = new Date(reservation.checkOut || reservation.checkOutDate);
  const nights = Math.ceil(
    (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
  );

  const formatDate = (date) => {
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  const getStatusClass = (status) => {
    const statusClassMap = {
      pending: "status-pending",
      confirmed: "status-confirmed",
      cancelled: "status-cancelled",
      completed: "status-completed",
      "no-show": "status-no-show"
    };
    return statusClassMap[status] || "";
  };

  const canCancel = () => {
    if (!reservation) return false;
    const status = reservation.status;
    const checkInDate = new Date(reservation.checkIn || reservation.checkInDate);
    const now = new Date();
    
    // 확정된 예약이고 체크인 날짜가 아직 지나지 않았으면 취소 가능
    return (status === "confirmed" || status === "pending") && checkInDate > now;
  };

  const handleCancelReservation = async () => {
    if (!cancelReason.trim()) {
      alert("취소 사유를 입력해주세요.");
      return;
    }

    if (!window.confirm("정말로 예약을 취소하시겠습니까? 취소 후에는 되돌릴 수 없습니다.")) {
      return;
    }

    try {
      setIsCancelling(true);
      const response = await cancelReservation(bookingId, cancelReason.trim());
      
      if (response.resultCode === "SUCCESS") {
        alert("예약이 취소되었습니다.");
        // 예약 정보 다시 불러오기
        const updatedResponse = await getReservationDetail(bookingId);
        if (updatedResponse.resultCode === "SUCCESS") {
          setReservation(updatedResponse.data);
        }
        setShowCancelModal(false);
        setCancelReason("");
      } else {
        alert(response.message || "예약 취소에 실패했습니다.");
      }
    } catch (err) {
      console.error("Failed to cancel reservation:", err);
      alert(err.response?.data?.message || "예약 취소에 실패했습니다.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="booking-detail-page">
      <div className="booking-detail-header">
        <button className="btn-back" onClick={() => navigate("/mypage/bookings")}>
          ← 예약 목록
        </button>
        <h1 className="page-title">예약 상세</h1>
      </div>

      <div className="booking-detail-content">
        {/* 예약 상태 배지 */}
        <div className="status-section">
          <span className={`status-badge ${getStatusClass(reservation.status)}`}>
            {getStatusText(reservation.status)}
          </span>
          <span className="reservation-id">예약 번호: {reservation._id || reservation.id}</span>
        </div>

        {/* 호텔 정보 */}
        <div className="detail-section hotel-section">
          <h2 className="booking-detail-section-title">호텔 정보</h2>
          <div className="hotel-info-card">
            {hotel.images && hotel.images[0] && (
              <img 
                src={hotel.images[0]} 
                alt={hotel.name} 
                className="hotel-image"
                onError={(e) => {
                  e.target.src = "/images/hotel.jpg";
                }}
              />
            )}
            <div className="hotel-details">
              <h3 className="hotel-name">{hotel.name || "호텔명 없음"}</h3>
              <p className="hotel-address">
                📍 {hotel.address || hotel.city || "주소 정보 없음"}
              </p>
              {hotel.amenities && hotel.amenities.length > 0 && (
                <div className="hotel-amenities">
                  <span className="amenities-label">편의시설:</span>
                  <span className="amenities-list">
                    {hotel.amenities.slice(0, 5).join(", ")}
                    {hotel.amenities.length > 5 && ` 외 ${hotel.amenities.length - 5}개`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 예약 정보 */}
        <div className="detail-section reservation-section">
          <h2 className="booking-detail-section-title">예약 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">객실</span>
              <span className="info-value">{room.name || room.type || "객실 정보 없음"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">체크인</span>
              <span className="info-value">
                {formatDate(checkInDate)}
                <span className="info-time"> 15:00</span>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">체크아웃</span>
              <span className="info-value">
                {formatDate(checkOutDate)}
                <span className="info-time"> 11:00</span>
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">숙박</span>
              <span className="info-value">{nights}박 {nights + 1}일</span>
            </div>
            <div className="info-item">
              <span className="info-label">인원</span>
              <span className="info-value">{reservation.guests || 2}명</span>
            </div>
            {reservation.specialRequests && (
              <div className="info-item full-width">
                <span className="info-label">특별 요청사항</span>
                <span className="info-value">{reservation.specialRequests}</span>
              </div>
            )}
          </div>
        </div>

        {/* 결제 정보 */}
        <div className="detail-section payment-section">
          <h2 className="booking-detail-section-title">결제 정보</h2>
          <div className="payment-details">
            <div className="payment-row">
              <span className="payment-label">객실 요금</span>
              <span className="payment-value">
                ₩{((room.price || 0) * nights).toLocaleString()}
              </span>
            </div>
            {payment.discount && payment.discount.total > 0 && (
              <div className="payment-row discount">
                <span className="payment-label">할인</span>
                <span className="payment-value">
                  -₩{payment.discount.total.toLocaleString()}
                </span>
              </div>
            )}
            <div className="payment-row total">
              <span className="payment-label">총 결제 금액</span>
              <span className="payment-value total-amount">
                ₩{(reservation.totalPrice || 0).toLocaleString()}
              </span>
            </div>
            {payment.method && (
              <div className="payment-row">
                <span className="payment-label">결제 수단</span>
                <span className="payment-value">
                  {payment.method === "card" ? "카드 결제" : 
                   payment.method === "toss" ? "토스페이먼츠" :
                   payment.method === "transfer" ? "계좌이체" :
                   payment.method === "cash" ? "현금" : payment.method}
                </span>
              </div>
            )}
            {payment.status && (
              <div className="payment-row">
                <span className="payment-label">결제 상태</span>
                <span className="payment-value">
                  {payment.status === "completed" ? "결제 완료" :
                   payment.status === "pending" ? "결제 대기" :
                   payment.status === "cancelled" ? "결제 취소" :
                   payment.status === "refunded" ? "환불 완료" : payment.status}
                </span>
              </div>
            )}
            {reservation.createdAt && (
              <div className="payment-row">
                <span className="payment-label">예약 일시</span>
                <span className="payment-value">
                  {formatDateTime(new Date(reservation.createdAt))}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="detail-actions">
          {canCancel() && (
            <button 
              className="btn-cancel"
              onClick={() => setShowCancelModal(true)}
            >
              예약 취소
            </button>
          )}
          {reservation.status === "confirmed" && (
            <button 
              className="btn-primary"
              onClick={() => navigate(`/hotels/${hotel._id || hotel.id}`)}
            >
              호텔 상세보기
            </button>
          )}
        </div>
      </div>

      {/* 취소 모달 */}
      {showCancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">예약 취소</h3>
            <p className="modal-description">
              예약을 취소하시겠습니까? 취소 사유를 입력해주세요.
            </p>
            <textarea
              className="cancel-reason-input"
              placeholder="취소 사유를 입력해주세요 (선택사항)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
            />
            <div className="modal-actions">
              <button
                className="btn-modal-secondary"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                disabled={isCancelling}
              >
                닫기
              </button>
              <button
                className="btn-modal-primary"
                onClick={handleCancelReservation}
                disabled={isCancelling}
              >
                {isCancelling ? "취소 중..." : "예약 취소하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingDetailPage;
