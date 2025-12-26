import React from "react";
import { useNavigate } from "react-router-dom";

const HeroCard = ({
    title,
    subtitle,
    description,
    backgroundImage,
    searchForm = true,
    className = "",
}) => {
    const navigate = useNavigate();

    const handleSearchClick = () => {
        navigate("/search");
    };

    return (
        <div
            className={`hero-card ${className}`}
            style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${backgroundImage})`,
            }}
        >
            <div className="hero-card-container">
                <div className="hero-content">
                    <h1 className="hero-title">{title}</h1>
                    <h2 className="hero-subtitle">{subtitle}</h2>
                    <p className="hero-description">{description}</p>
                </div>
                <button 
                    className="hero-cta-button"
                    onClick={handleSearchClick}
                >
                    <span className="button-icon">🔍</span>
                    <span className="button-text">숙소 찾기</span>
                </button>
            </div>
        </div>
    );
};

export default HeroCard;