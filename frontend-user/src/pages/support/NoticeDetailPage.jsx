import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import { getNoticeById } from "../../api/noticeClient";
import "../../styles/pages/support/SupportPage.scss";

const NoticeDetailPage = () => {
  const { noticeId } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const noticeData = await getNoticeById(noticeId);
        setNotice(noticeData);
      } catch (err) {
        console.error("공지사항 조회 실패:", err);
        setError("공지사항을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (noticeId) {
      fetchNotice();
    }
  }, [noticeId]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      notice: "공지",
      event: "이벤트",
      maintenance: "점검",
      update: "업데이트",
    };
    return typeMap[type] || "공지";
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="support-page">
          <div className="support-container inner">
            <div className="notice-loading">로딩 중...</div>
          </div>
        </div>
        <Footer />
        <FloatingNav />
      </>
    );
  }

  if (error || !notice) {
    return (
      <>
        <Header />
        <div className="support-page">
          <div className="support-container inner">
            <div className="notice-error">{error || "공지사항을 찾을 수 없습니다."}</div>
            <button className="support-back" onClick={() => navigate('/support/notices')}>
              &larr; 목록으로 돌아가기
            </button>
          </div>
        </div>
        <Footer />
        <FloatingNav />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="support-page">
        <div className="support-subnav">
          <button className="support-back" onClick={() => navigate('/support/notices')}>&larr; 뒤로가기</button>
        </div>

        <div className="support-header">
          <div className="notice-detail-header">
            {notice.isPinned && <span className="notice-pin">📌</span>}
            <span className="notice-type-badge">{getTypeLabel(notice.type)}</span>
          </div>
          <h1>{notice.title}</h1>
          <p className="notice-meta">{formatDate(notice.createdAt)}</p>
        </div>

        <div className="support-container inner">
          <article className="notice-detail">
            <div className="notice-content" dangerouslySetInnerHTML={{ __html: notice.content.replace(/\n/g, '<br />') }} />
          </article>
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </>
  );
};

export default NoticeDetailPage;