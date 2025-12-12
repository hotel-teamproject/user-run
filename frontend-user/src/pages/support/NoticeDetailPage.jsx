import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import "../../styles/pages/support/SupportPage.scss";

const NoticeDetailPage = () => {
  const { noticeId } = useParams();
  const navigate = useNavigate();

  // 실제 API 연결시 noticeId로 조회
  const notice = { id: noticeId, title: "서비스 점검 안내", date: "2025-12-01", body: "서비스 점검으로 인해 일부 기능이 일시 중단됩니다." };

  return (
    <>
      <Header />

      <div className="support-page">
        <div className="support-subnav">
          <button className="support-back" onClick={() => navigate('/support/notices')}>&larr; 뒤로가기</button>
        </div>

        <div className="support-header">
          <h1>{notice.title}</h1>
          <p className="notice-meta">{notice.date}</p>
        </div>

        <div className="support-container inner">
          <article className="notice-detail">
            <p>{notice.body}</p>
          </article>
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </>
  );
};

export default NoticeDetailPage;