import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getUserCoupons } from "../../api/couponClient";
import StaybookLogo from "./StaybookLogo";
import "../../styles/components/common/Header.scss";

const Header = () => {
  const { user, isAuthed, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [couponCount, setCouponCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const hideDropdownTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchCouponCount = async () => {
      if (!isAuthed) {
        setCouponCount(0);
        return;
      }

      try {
        const data = await getUserCoupons();
        const available = data?.available || [];
        setCouponCount(available.length);
      } catch (error) {
        console.error("헤더 쿠폰 정보 조회 실패:", error);
      }
    };

    fetchCouponCount();

    // 언마운트 시 드롭다운 타이머 정리
    return () => {
      if (hideDropdownTimeoutRef.current) {
        clearTimeout(hideDropdownTimeoutRef.current);
      }
    };
  }, [isAuthed]);

  const handleMouseEnterMenu = () => {
    if (hideDropdownTimeoutRef.current) {
      clearTimeout(hideDropdownTimeoutRef.current);
      hideDropdownTimeoutRef.current = null;
    }
    setShowDropdown(true);
  };

  const handleMouseLeaveMenu = () => {
    // 약간의 지연 후 드롭다운 닫기 (호버가 살짝 벗어나도 바로 닫히지 않도록)
    hideDropdownTimeoutRef.current = setTimeout(() => {
      setShowDropdown(false);
      hideDropdownTimeoutRef.current = null;
    }, 200);
  };

  const handleLogout = () => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
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

        {/* 모바일 햄버거 버튼 */}
        <button
          type="button"
          className={`header-menu-toggle ${isMobileMenuOpen ? "is-open" : ""}`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="메뉴 열기"
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>

        {/* 네비게이션 */}
        <nav className="header-nav">
          <NavLink
            to="/search"
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <span className="nav-icon">🔍</span>
            <span className="nav-text">숙소 찾기</span>
          </NavLink>

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
              onMouseEnter={handleMouseEnterMenu}
              onMouseLeave={handleMouseLeaveMenu}
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
                      to="/mypage/wishlist"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="dropdown-icon">❤️</span>
                      <span>찜 목록</span>
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
                      to="/mypage/coupons"
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="dropdown-icon">🎫</span>
                      <span>
                        쿠폰
                        {couponCount > 0 && (
                          <span className="coupon-badge">
                            {couponCount}
                          </span>
                        )}
                      </span>
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

      {/* 모바일 전용 드롭다운 메뉴 */}
      {isMobileMenuOpen && (
        <div className="header-mobile-menu">
          <nav className="mobile-nav">
            <NavLink
              to="/search"
              className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              숙소 찾기
            </NavLink>

            <NavLink
              to="/support"
              className={({ isActive }) => (isActive ? "mobile-nav-link active" : "mobile-nav-link")}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              고객센터
            </NavLink>
          </nav>

          <div className="mobile-auth">
            {isAuthed ? (
              <>
                <button
                  type="button"
                  className="mobile-auth-link"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/mypage");
                  }}
                >
                  마이페이지
                </button>
                <button
                  type="button"
                  className="mobile-auth-link logout"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="mobile-auth-link"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  로그인
                </button>
                <button
                  type="button"
                  className="mobile-auth-link primary"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/signup");
                  }}
                >
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
