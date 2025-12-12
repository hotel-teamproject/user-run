import { Link, useLocation } from "react-router-dom";
import "../../styles/components/mypage/MypageNav.scss";

const MyPageNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/mypage/account", label: "계정" },
    { path: "/mypage/bookings", label: "내역" },
    { path: "/mypage/payment", label: "결제수단" },
  ];

  return (
    <nav className="mypage-nav">
      <ul className="nav-list">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`nav-link ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MyPageNav;
