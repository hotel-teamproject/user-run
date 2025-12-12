import React from "react";
import Newsletter from "./Newsletter";  // 다시 포함한다!
import StaybookLogo from "./StaybookLogo";
import "../../styles/components/common/Footer.scss";

// Footer 정적 데이터 (mock이 아닌 상수 데이터)
const footerNavData = [
  {
    title: "Our Destinations",
    links: [
      { name: "Canada", href: "#" },
      { name: "Alaska", href: "#" },
      { name: "France", href: "#" },
      { name: "Iceland", href: "#" },
    ],
  },
  {
    title: "Our Activities",
    links: [
      { name: "Northern Lights", href: "#" },
      { name: "Cruising & sailing", href: "#" },
      { name: "Multi-activities", href: "#" },
      { name: "Kayaking", href: "#" },
    ],
  },
  {
    title: "Travel Blogs",
    links: [
      { name: "Bali Travel Guide", href: "#" },
      { name: "Sri Lanka Travel Guide", href: "#" },
      { name: "Peru Travel Guide", href: "#" },
      { name: "Japan Travel Guide", href: "#" },
    ],
  },
  {
    title: "About Us",
    links: [
      { name: "Our Story", href: "#" },
      { name: "Work with us", href: "#" },
    ],
  },
  {
    title: "Contact Us",
    links: [
      { name: "Contact Form", href: "#" },
      { name: "Support", href: "#" },
    ],
  },
];

const Footer = () => {
    return (
        <footer className="footer">

            {/* 🔥 Newsletter는 Footer 안에서 absolute로 띄울 예정 */}
            <div className="newsletter-wrapper">
                <Newsletter />
            </div>

            <div className="footer-links">
                <div className="inner">
                    <div className="social-links">
                        <div className="logo">
                            <StaybookLogo size="medium" />
                        </div>
                        <p className="description">
                            혁신적 호텔 여행의 모든 순간, HotelHub과 함께하세요.
                        </p>
                    </div>

                    <div className="footer-menu">
                        <div className="link-columns">
                            {footerNavData.map((column, columnIndex) => (
                                <div key={columnIndex} className="link-column">
                                    <h4>{column.title}</h4>
                                    <ul>
                                        {column.links.map((link, linkIndex) => (
                                            <li key={linkIndex}>
                                                <a href={link.href}>{link.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="follow-us">
                            <h4 className="follow-title">Follow Us</h4>
                            <div className="follow-icons">
                                <a href="#" className="follow-link" aria-label="Facebook">
                                    <img src="/images/Facebook.png" alt="facebook" className="icon-img" />
                                </a>
                                <a href="#" className="follow-link" aria-label="Twitter">
                                    <img src="/images/Twitter.png" alt="twitter" className="icon-img" />
                                </a>
                                <a href="#" className="follow-link" aria-label="YouTube">
                                    <img src="/images/Youtube.png" alt="youtube" className="icon-img" />
                                </a>
                                <a href="#" className="follow-link" aria-label="Instagram">
                                    <img src="/images/Instagram.png" alt="instagram" className="icon-img" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="inner">
                    <div className="footer-info">
                        <div className="company-info">
                            (주)스테이북 | 대표: 홍길동 | 사업자등록번호: 123-45-67890
                            <br />
                            주소: 서울특별시 강남구 테헤란로 123, 4567 | 통신판매업신고:
                            제2025-서울강남-1234호
                        </div>
                        <div className="copyright">
                            © 2025 STAYBOOK Inc. All rights reserved.
                        </div>
                    </div>
                    <div className="footer-contact">
                        <div className="contact-info">
                            고객센터: 1588-0000 (09:00 - 18:00) | 이메일: support@staybook.com
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
