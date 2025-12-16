import React from "react";
import { Link } from "react-router-dom";
import Newsletter from "./Newsletter";
import StaybookLogo from "./StaybookLogo";
import "../../styles/components/common/Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Newsletter 섹션 */}
      <div className="newsletter-section">
        <Newsletter />
      </div>

      {/* Footer 메인 컨텐츠 */}
      <div className="footer-main">
        <div className="footer-inner">
          {/* 왼쪽: 로고 및 설명 */}
          <div className="footer-brand">
            <div className="footer-logo">
              <StaybookLogo size="medium" />
            </div>
            <p className="footer-description">
              혁신적 호텔 여행의 모든 순간,<br />
              STAYBOOK과 함께하세요.
            </p>
            <div className="social-links">
              <a 
                href="https://www.facebook.com/staybook" 
                className="social-link" 
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/Facebook.png" alt="Facebook" />
              </a>
              <a 
                href="https://twitter.com/staybook" 
                className="social-link" 
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/Twitter.png" alt="Twitter" />
              </a>
              <a 
                href="https://www.youtube.com/@staybook" 
                className="social-link" 
                aria-label="YouTube"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/Youtube.png" alt="YouTube" />
              </a>
              <a 
                href="https://www.instagram.com/staybook" 
                className="social-link" 
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/images/Instagram.png" alt="Instagram" />
              </a>
            </div>
          </div>

          {/* 오른쪽: 링크 그룹 */}
          <div className="footer-links">
            <div className="footer-link-group">
              <h4 className="link-group-title">인기 지역</h4>
              <ul className="link-list">
                <li><Link to="/search?destination=서울">서울</Link></li>
                <li><Link to="/search?destination=부산">부산</Link></li>
                <li><Link to="/search?destination=제주도">제주도</Link></li>
                <li><Link to="/search?destination=경주">경주</Link></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="link-group-title">서비스</h4>
              <ul className="link-list">
                <li><Link to="/search">호텔 검색</Link></li>
                <li><Link to="/mypage/coupons">쿠폰</Link></li>
                <li><Link to="/mypage/points">포인트</Link></li>
                <li><Link to="/mypage/bookings">예약 내역</Link></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="link-group-title">고객 지원</h4>
              <ul className="link-list">
                <li><Link to="/support">고객센터</Link></li>
                <li><Link to="/support/faq">자주 묻는 질문</Link></li>
                <li><Link to="/support/notices">공지사항</Link></li>
                <li><Link to="/support/contact">문의하기</Link></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="link-group-title">회사 정보</h4>
              <ul className="link-list">
                <li><Link to="/company/about">회사 소개</Link></li>
                <li><Link to="/company/terms">이용약관</Link></li>
                <li><Link to="/company/privacy">개인정보처리방침</Link></li>
                <li><Link to="/company/careers">채용 정보</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer 하단 */}
      <div className="footer-bottom">
        <div className="footer-inner">
          <div className="footer-bottom-content">
            <div className="company-info">
              <p>
                (주)스테이북 | 대표: 홍길동 | 사업자등록번호: 123-45-67890
              </p>
              <p>
                주소: 서울특별시 강남구 테헤란로 123, 4567 | 통신판매업신고: 제2025-서울강남-1234호
              </p>
              <p>
                고객센터: 1588-0000 (09:00 - 18:00) | 이메일: support@staybook.com
              </p>
            </div>
            <div className="copyright">
              <p>© 2025 STAYBOOK Inc. 모든 권리 보유.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
