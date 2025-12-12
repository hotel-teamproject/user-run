import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import "../../styles/pages/support/SupportPage.scss";

const NoticeListPage = () => {
  const navigate = useNavigate();

  const goBack = () => navigate('/support');

  const notices = [
    { id: 1, title: "서비스 점검 안내", date: "2025-12-01" },
    { id: 2, title: "연말 프로모션 안내", date: "2025-11-15" },
  ];

  return (
    <>
      <Header />

      <div className="support-page">
        <div className="support-subnav">
          <button className="support-back" onClick={goBack}>&larr; 뒤로가기</button>
        </div>

        <div className="support-header">
          <h1>공지사항</h1>
          <p>중요한 공지사항을 확인하세요.</p>
        </div>

        <div className="support-container inner">
          <ul className="notice-list">
            {notices.map((n) => (
              <li key={n.id} className="notice-item" onClick={() => navigate(`/support/notices/${n.id}`)}>
                <div className="notice-title">{n.title}</div>
                <div className="notice-date">{n.date}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </>
  );
};

export default NoticeListPage;
