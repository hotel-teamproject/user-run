import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/home/DestinationCard.scss";

const DestinationCard = ({ destination }) => {
  const { name, country, image, description } = destination;
  const navigate = useNavigate();

  const handleClick = () => {
    // 지역 이름을 목적지 쿼리로 전달하여 해당 지역 숙소 검색
    const query = new URLSearchParams({ destination: name }).toString();
    navigate(`/search?${query}`);
  };

  return (
    <div className="destination-card">
      <div className="card-image">
        <img src={image} alt={name} />
      </div>

      <div className="card-content">
        <h3 className="destination-name">{name}</h3>
        {country && country !== "한국" && (
          <p className="destination-country">{country}</p>
        )}
        <p className="destination-description">{description}</p>

        <button className="btn-book" onClick={handleClick}>
          자세히 보기
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;
