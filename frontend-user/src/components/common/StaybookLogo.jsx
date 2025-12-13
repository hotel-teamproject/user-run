import React from "react";
import "./StaybookLogo.scss";

const StaybookLogo = ({ size = "medium" }) => {
  return (
    <div className={`staybook-logo ${size}`}>
      <span className="logo-text">STAYBOOK</span>
    </div>
  );
};

export default StaybookLogo;
