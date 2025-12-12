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
      <div className="inner">

        {/* 로고 */}
        <h1 className="logo">
          <Link to="/">
            <StaybookLogo size="medium" />
          </Link>
        </h1>

        {/* 네비게이션 */}
        <nav className="nav">
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span className="nav-icon">🔍</span> Find Stays
          </NavLink>

          {isAuthed && (
            <NavLink
              to="/mypage/wishlist"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="nav-icon">❤️</span> 찜하기
            </NavLink>
          )}

          <NavLink
            to="/support"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            고객센터
          </NavLink>
        </nav>

        {/* 우측 로그인/로그아웃 메뉴 */}
        <div className="auth-links">
          {isAuthed ? (
            <div
              className="user-menu"
              onMouseEnter={() => setShowDropdown(true)}
            >
              <button className="user-button">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="user-avatar"
                  />
                ) : (
                  <div
                    className="user-avatar-placeholder"
                    onClick={() => navigate("/mypage/account")}
                  >
                    {user?.name?.charAt(0) || "U"}
                  </div>
                )}
                <span className="user-name">{user?.name || "사용자"}</span>
              </button>

              {showDropdown && (
                <div
                  className="dropdown-menu"
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{user?.name}</div>
                    <div className="dropdown-user-email">
                      {user?.email || "Online"}
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <Link
                    to="/mypage"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="dropdown-icon">👤</span> 개인
                  </Link>

                  <Link
                    to="/mypage/bookings"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="dropdown-icon">📋</span> 내역
                  </Link>

                  <Link
                    to="/mypage/payment"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="dropdown-icon">💳</span> 추가사항
                  </Link>

                  <div className="dropdown-divider"></div>

                  <Link
                    to="/mypage/account"
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <span className="dropdown-icon">⚙️</span> 설정
                  </Link>

                  <button className="dropdown-item" onClick={handleLogout}>
                    <span className="dropdown-icon">🚪</span> 로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn--sm btn--primary">
                로그인
              </Link>
              <Link to="/signup" className="btn--sm btn--outline">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
