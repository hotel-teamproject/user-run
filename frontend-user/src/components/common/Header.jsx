import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import StaybookLogo from "./StaybookLogo";
import "../../styles/components/common/Header.scss";

const Header = () => {
  const { user, isAuthed, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    window.location.href = "/";
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* 로고 */}
        <div className="header-logo">
          <Link to="/">
            <StaybookLogo size="medium" />
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="header-nav">
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-text">숙소 찾기</span>
          </NavLink>

          {isAuthed && (
            <NavLink
              to="/mypage/wishlist"
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              <span className="nav-icon">❤️</span>
              <span className="nav-text">찜 목록</span>
            </NavLink>
          )}

          <NavLink
            to="/support"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <span className="nav-text">고객센터</span>
          </NavLink>
        </nav>

        {/* 우측 인증 메뉴 */}
        <div className="header-auth">
          {isAuthed ? (
            <div
              className="user-menu"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className="user-button">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="프로필"
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <span className="user-name">{user?.name || "사용자"}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-user-info">
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="프로필"
                          className="dropdown-avatar"
                        />
                      ) : (
                        <div className="dropdown-avatar-placeholder">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="dropdown-user-details">
                        <div className="dropdown-user-name">{user?.name || "사용자"}</div>
                        <div className="dropdown-user-email">
                          {user?.email || "온라인"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-items">
                    <Link
                      to="/mypage"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="dropdown-icon">👤</span>
                      <span>마이페이지</span>
                    </Link>

                    <Link
                      to="/mypage/bookings"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="dropdown-icon">📋</span>
                      <span>예약 내역</span>
                    </Link>

                    <Link
                      to="/mypage/payment"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="dropdown-icon">💳</span>
                      <span>결제 수단</span>
                    </Link>

                    <div className="dropdown-divider"></div>

                    <Link
                      to="/mypage/account"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="dropdown-icon">⚙️</span>
                      <span>계정 설정</span>
                    </Link>

                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <span className="dropdown-icon">🚪</span>
                      <span>로그아웃</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">
                로그인
              </Link>
              <Link to="/signup" className="btn-signup">
                회원가입
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
