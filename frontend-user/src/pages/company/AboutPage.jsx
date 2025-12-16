import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import "../../styles/pages/company/CompanyPage.scss";

const AboutPage = () => {
  return (
    <>
      <Header />

      <div className="company-page">
        <div className="company-header">
          <h1>회사 소개</h1>
          <p>STAYBOOK은 최고의 호텔 예약 경험을 제공합니다.</p>
        </div>

        <div className="company-container inner">
          <section className="company-section">
            <h2>STAYBOOK 소개</h2>
            <div className="company-content">
              <p>
                STAYBOOK은 2025년에 설립된 혁신적인 호텔 예약 플랫폼입니다. 
                고객들에게 최고의 숙박 경험을 제공하기 위해 끊임없이 노력하고 있습니다.
              </p>
              <p>
                우리는 전국 각지의 다양한 호텔과 파트너십을 맺고, 고객들이 
                가장 적합한 숙소를 쉽게 찾고 예약할 수 있도록 서비스를 제공합니다.
              </p>
            </div>
          </section>

          <section className="company-section">
            <h2>비전</h2>
            <div className="company-content">
              <p>
                STAYBOOK은 모든 사람이 편리하고 안전하게 최고의 숙박 경험을 
                누릴 수 있는 세상을 만들어갑니다.
              </p>
            </div>
          </section>

          <section className="company-section">
            <h2>핵심 가치</h2>
            <div className="company-content">
              <ul className="value-list">
                <li>
                  <strong>고객 중심</strong>
                  <p>고객의 만족을 최우선으로 생각합니다.</p>
                </li>
                <li>
                  <strong>혁신</strong>
                  <p>지속적인 기술 혁신으로 더 나은 서비스를 제공합니다.</p>
                </li>
                <li>
                  <strong>신뢰</strong>
                  <p>투명하고 정직한 서비스로 고객의 신뢰를 얻습니다.</p>
                </li>
                <li>
                  <strong>협력</strong>
                  <p>호텔 파트너와의 상생을 추구합니다.</p>
                </li>
              </ul>
            </div>
          </section>

          <section className="company-section">
            <h2>연락처</h2>
            <div className="company-content">
              <div className="contact-info">
                <p><strong>회사명:</strong> (주)스테이북</p>
                <p><strong>대표:</strong> 홍길동</p>
                <p><strong>사업자등록번호:</strong> 123-45-67890</p>
                <p><strong>주소:</strong> 서울특별시 강남구 테헤란로 123, 4567</p>
                <p><strong>통신판매업신고:</strong> 제2025-서울강남-1234호</p>
                <p><strong>고객센터:</strong> 1588-0000 (09:00 - 18:00)</p>
                <p><strong>이메일:</strong> support@staybook.com</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </>
  );
};

export default AboutPage;

