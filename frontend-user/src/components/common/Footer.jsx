import React from "react";
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
              <a href="#" className="social-link" aria-label="Facebook">
                <img src="/images/Facebook.png" alt="Facebook" />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <img src="/images/Twitter.png" alt="Twitter" />
              </a>
              <a href="#" className="social-link" aria-label="YouTube">
                <img src="/images/Youtube.png" alt="YouTube" />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <img src="/images/Instagram.png" alt="Instagram" />
              </a>
            </div>
          </div>

          {/* 오른쪽: 링크 그룹 */}
          <div className="footer-links">
            <div className="footer-link-group">
              <h4 className="link-group-title">인기 여행지</h4>
              <ul className="link-list">
                <li><a href="#">캐나다</a></li>
                <li><a href="#">알래스카</a></li>
                <li><a href="#">프랑스</a></li>
                <li><a href="#">아이슬란드</a></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="link-group-title">인기 액티비티</h4>
              <ul className="link-list">
                <li><a href="#">오로라 투어</a></li>
                <li><a href="#">크루즈 & 세일링</a></li>
                <li><a href="#">다양한 액티비티</a></li>
                <li><a href="#">카약 투어</a></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="link-group-title">여행 블로그</h4>
              <ul className="link-list">
                <li><a href="#">발리 여행 가이드</a></li>
                <li><a href="#">스리랑카 여행 가이드</a></li>
                <li><a href="#">페루 여행 가이드</a></li>
                <li><a href="#">일본 여행 가이드</a></li>
              </ul>
            </div>

            <div className="footer-link-group">
              <h4 className="link-group-title">고객 지원</h4>
              <ul className="link-list">
                <li><a href="#">회사 소개</a></li>
                <li><a href="#">채용 정보</a></li>
                <li><a href="#">문의하기</a></li>
                <li><a href="#">고객센터</a></li>
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
