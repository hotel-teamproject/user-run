import React from "react";
import "../../styles/components/home/HeroCard.scss";

const HeroCard = ({
    title,
    subtitle,
    description,
    backgroundImage,
    searchForm = true,
    className = "",
}) => {
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



            </div>
        </div>
    );
};

export default HeroCard;