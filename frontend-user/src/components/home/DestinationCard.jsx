import React from "react";
import "../../styles/components/home/DestinationCard.scss";

const DestinationCard = ({ destination }) => {
  const { name, country, image, price, description } = destination;

  return (
    <div className="destination-card">
      <div className="card-image">
        <img src={image} alt={name} />
      </div>

      <div className="card-content">
        <h3 className="destination-name">{name}</h3>
        <p className="destination-country">{country}</p>
        <p className="destination-description">{description}</p>

        <div className="card-footer">
          <span className="price">₩{price.toLocaleString()}</span>
        </div>

        <button className="btn-book">Book a Hotel</button>
      </div>
    </div>
  );
};

export default DestinationCard;
