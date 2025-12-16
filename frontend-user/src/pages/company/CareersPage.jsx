import React from "react";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import "../../styles/pages/company/CompanyPage.scss";

const CareersPage = () => {
  return (
    <>
      <Header />

      <div className="company-page">
        <div className="company-header">
          <h1>채용 정보</h1>
          <p>STAYBOOK과 함께 성장할 인재를 찾습니다.</p>
        </div>

        <div className="company-container inner">
          <section className="company-section">
            <h2>채용 안내</h2>
            <div className="company-content">
              <p>
                STAYBOOK은 혁신적인 호텔 예약 플랫폼을 만들어가는 팀입니다. 
                우리와 함께 고객에게 최고의 서비스를 제공하고, 
                여행 산업의 미래를 만들어갈 인재를 찾고 있습니다.
              </p>
            </div>
          </section>

          <section className="company-section">
            <h2>우리가 찾는 인재</h2>
            <div className="company-content">
              <ul className="value-list">
                <li>
                  <strong>고객 중심 사고</strong>
                  <p>고객의 니즈를 이해하고 해결책을 제시할 수 있는 분</p>
                </li>
                <li>
                  <strong>협업 능력</strong>
                  <p>팀과 함께 성장하고 발전할 수 있는 분</p>
                </li>
                <li>
                  <strong>도전 정신</strong>
                  <p>새로운 기술과 방법을 적극적으로 학습하고 적용할 수 있는 분</p>
                </li>
                <li>
                  <strong>책임감</strong>
                  <p>주어진 업무에 대해 책임감을 가지고 완수할 수 있는 분</p>
                </li>
              </ul>
            </div>
          </section>

          <section className="company-section">
            <h2>채용 프로세스</h2>
            <div className="company-content">
              <ol className="process-list">
                <li>
                  <strong>서류 전형</strong>
                  <p>이력서 및 자기소개서 검토</p>
                </li>
                <li>
                  <strong>1차 면접</strong>
                  <p>직무 역량 및 인성 평가</p>
                </li>
                <li>
                  <strong>2차 면접</strong>
                  <p>임원 면접 및 최종 평가</p>
                </li>
                <li>
                  <strong>최종 합격</strong>
                  <p>합격자 발표 및 입사 절차 안내</p>
                </li>
              </ol>
            </div>
          </section>

          <section className="company-section">
            <h2>복리후생</h2>
            <div className="company-content">
              <ul className="benefits-list">
                <li>경쟁력 있는 연봉 및 성과급</li>
                <li>4대 보험 및 퇴직금</li>
                <li>자유로운 휴가 제도</li>
                <li>교육비 지원</li>
                <li>건강검진 지원</li>
                <li>사내 카페테리아</li>
                <li>재택근무 가능</li>
                <li>다양한 팀 빌딩 활동</li>
              </ul>
            </div>
          </section>

          <section className="company-section">
            <h2>지원 방법</h2>
            <div className="company-content">
              <p>
                채용 공고가 있을 경우, 아래 이메일로 지원해주시기 바랍니다.
              </p>
              <div className="contact-info">
                <p><strong>채용 담당자</strong></p>
                <p>이메일: careers@staybook.com</p>
                <p>전화: 1588-0000 (내선 2번)</p>
                <p>운영시간: 평일 09:00 - 18:00</p>
              </div>
              <p className="note">
                * 현재 특정 포지션에 대한 공고가 없을 수 있습니다. 
                관심 있는 분들은 이메일로 문의해주시면 추후 공고 시 연락드리겠습니다.
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </>
  );
};

export default CareersPage;

