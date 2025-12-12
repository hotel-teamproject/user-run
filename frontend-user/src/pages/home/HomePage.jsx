import React from "react";
import HeroSection from "../../components/home/HeroSection";
import PopularDestinations from "../../components/home/PopularDestinations";
import TravelMore from "../../components/home/TravelMore";
import HeroSearchWrap from "../../components/home/HeroSearchWrap";
import "../../styles/pages/home/HomePage.scss";

const HomePage = () => {
  return (
    <div className="home-page top-container">
      <HeroSection />
      <HeroSearchWrap />
      <PopularDestinations />
      <TravelMore />
    </div>
  );
};

export default HomePage;