import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import { getNotices } from "../../api/noticeClient";
import "../../styles/pages/support/SupportPage.scss";

const NoticeListPage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true);
        const result = await getNotices({ page: 1, limit: 10 });
        setNotices(result.notices || []);
        if (result.pagination) {
          setPagination(result.pagination);
        }
      } catch (err) {
        console.error("공지사항 조회 실패:", err);
        setError("공지사항을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
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

  return (
    <>
      <Header />

      <div className="support-page">
        <div className="support-header">
          <h1>공지사항</h1>
          <p>중요한 공지사항을 확인하세요.</p>
        </div>

        <div className="support-container inner">
          {loading ? (
            <div className="notice-loading">로딩 중...</div>
          ) : error ? (
            <div className="notice-error">{error}</div>
          ) : notices.length === 0 ? (
            <div className="notice-empty">등록된 공지사항이 없습니다.</div>
          ) : (
            <ul className="notice-list">
              {notices.map((notice) => (
                <li
                  key={notice._id}
                  className={`notice-item ${notice.isPinned ? "pinned" : ""}`}
                  onClick={() => navigate(`/support/notices/${notice._id}`)}
                >
                  <div className="notice-content">
                    <div className="notice-header">
                      {notice.isPinned && <span className="notice-pin">📌</span>}
                      <span className="notice-type">{getTypeLabel(notice.type)}</span>
                      <div className="notice-title">{notice.title}</div>
                    </div>
                    <div className="notice-footer">
                      <div className="notice-date">{formatDate(notice.createdAt)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </>
  );
};

export default NoticeListPage;
