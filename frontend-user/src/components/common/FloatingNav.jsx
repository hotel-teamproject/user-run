import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaUser, FaHeadset, FaHeart, FaEllipsisV } from "react-icons/fa";
import "../../styles/components/FloatingNav.scss";

const FloatingNav = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setOpen(false);
  };
  const goProfile = () => {
    navigate("/mypage");
    setOpen(false);
  };
  const goSupport = () => {
    navigate("/support");
    setOpen(false);
  };
  const goWishlist = () => {
    navigate("/mypage/wishlist");
    setOpen(false);
  };

  return (
    <div className={`floating-nav-wrap ${visible ? "show" : "hide"}`}>
      <button
        className={`fn-toggle ${open ? "active" : ""}`}
        onClick={() => setOpen((s) => !s)}
        aria-label={open ? "플로팅 메뉴 닫기" : "플로팅 메뉴 열기"}
      >
        <FaEllipsisV />
      </button>

      <div className={`floating-nav ${open ? "open" : ""}`} aria-hidden={!open}>
        <button className="fn-btn" onClick={handleTop} aria-label="위로 이동">
          <FaArrowUp />
        </button>
        <button className="fn-btn" onClick={goProfile} aria-label="내 정보">
          <FaUser />
        </button>
        <button className="fn-btn" onClick={goSupport} aria-label="고객센터">
          <FaHeadset />
        </button>
        <button className="fn-btn" onClick={goWishlist} aria-label="찜하기">
          <FaHeart />
        </button>
      </div>
    </div>
  );
};

export default FloatingNav;