import React from "react";
import "./styles/Newsletter.scss";

const Newsletter = () => {
  return (
    <section className="newsletter-wrapper">
      <div className="newsletter">

        {/* 왼쪽 텍스트 */}
        <div className="newsletter-left">
          <h2 className="newsletter-title">
            구독서비스<br />신청해보세요
          </h2>

          <div className="newsletter-desc">
            <p className="travel-title">The Travel</p>
            <p className="travel-sub">구독하고 쿠폰, 최신 이벤트를 받아보세요</p>
          </div>

          {/* 입력 영역 */}
          <div className="newsletter-input-wrapper">
            <input
              type="email"
              placeholder="Your email address"
              className="newsletter-input"
            />
            <button className="newsletter-btn">Subscribe</button>
          </div>
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
