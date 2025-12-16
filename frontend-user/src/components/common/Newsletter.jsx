import React, { useState } from "react";
import { subscribeNewsletter } from "../../api/subscriptionClient";
import "./styles/Newsletter.scss";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 이메일 형식 검증
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!email.trim()) {
      setMessage("이메일을 입력해주세요.");
      setMessageType("error");
      return;
    }
    
    if (!emailRegex.test(email.trim())) {
      setMessage("유효한 이메일 주소를 입력해주세요.");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await subscribeNewsletter(email.trim());
      
      if (response.success) {
        setMessage(response.message || "구독이 완료되었습니다!");
        setMessageType("success");
        setEmail(""); // 성공 시 입력 필드 초기화
        
        // 3초 후 메시지 숨기기
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
      }
    } catch (error) {
      console.error("구독 신청 실패:", error);
      setMessage(
        error.response?.data?.message || 
        "구독 신청 중 오류가 발생했습니다. 다시 시도해주세요."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="newsletter-wrapper">
      <div className="newsletter">

        {/* 왼쪽 텍스트 */}
        <div className="newsletter-left">
          <h2 className="newsletter-title">
            구독서비스<br />신청해보세요
          </h2>

          <div className="newsletter-desc">
            <p className="travel-title">더 트래블</p>
            <p className="travel-sub">구독하고 쿠폰, 최신 이벤트를 받아보세요</p>
          </div>

          {/* 입력 영역 */}
          <form className="newsletter-input-wrapper" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="이메일 주소를 입력하세요"
              className="newsletter-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setMessage(""); // 입력 시 메시지 초기화
              }}
              maxLength={100}
              disabled={loading}
            />
            <button 
              type="submit"
              className="newsletter-btn"
              disabled={loading}
            >
              {loading ? "처리 중..." : "구독하기"}
            </button>
          </form>
          
          {/* 메시지 표시 */}
          {message && (
            <div className={`newsletter-message ${messageType}`}>
              {message}
            </div>
          )}
        </div>

        {/* 우측 이미지 */}
        <div className="newsletter-right">
          <img
            src="/images/hotel-3.png"
            alt="hotel-subscribe"
            className="newsletter-img"
          />
        </div>

      </div>
    </section>
  );
};

export default Newsletter;
