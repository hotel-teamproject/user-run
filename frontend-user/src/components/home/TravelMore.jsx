import React from "react";
import MalakaTour from "./MalakaTour";
import TravelGallery from "./TravelGallery";
import "../../styles/components/home/TravelMore.scss";

const TravelMore = () => {
 return (
  <section className="travel-more">
   <div className="container">
    <div className="section-header">
     <h2 className="section-title">여행 더보기</h2>
     <button className="see-all-btn">See All</button>
    </div>
    <p className="section-subtitle">
     Going somewhere to celebrate this season? Whether you're going home or
     somewhere to roam, we've got the travel tools to get you to your
     destination.
    </p>

    <div className="travel-content">
     <MalakaTour />
     <TravelGallery />
    </div>
   </div>
  </section>
 );
};

export default TravelMore;