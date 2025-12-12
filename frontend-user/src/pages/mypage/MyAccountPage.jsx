import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/pages/mypage/MyAccountPage.scss";

const MyAccountPage = () => {
  const { user, setUser } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    password: false,
    phone: false,
    address: false,
    dateOfBirth: false,
  });

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "************",
    phone: user?.phone || "",
    address: "경기도 화성시 화옹로 도메이아파트 101동 101호",
    dateOfBirth: "1999-99-99",
  });

  const handleChange = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: false }));

    if (["name", "email", "phone"].includes(field)) {
      const updatedUser = { ...user, [field]: formData[field] };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <div className="mypage-container">
      <div className="account-content">
        <h2 className="account-title">Account</h2>

        <div className="account-form">

          {/* ================== NAME ================== */}
          <div className="form-field">
            <div className="field-left">
              <span className="field-label">Name</span>
              {isEditing.name ? (
                <input
                  type="text"
                  name="name"
                  className="field-input"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="field-value">{formData.name}</span>
              )}
            </div>

            <button
              className={`change-button ${isEditing.name ? "active" : ""}`}
              onClick={() =>
                isEditing.name ? handleSave("name") : handleChange("name")
              }
            >
              {isEditing.name ? "Save" : "Change"}
            </button>
          </div>

          {/* ================== EMAIL ================== */}
          <div className="form-field">
            <div className="field-left">
              <span className="field-label">Email</span>
              {isEditing.email ? (
                <input
                  type="email"
                  name="email"
                  className="field-input"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="field-value">{formData.email}</span>
              )}
            </div>

            <button
              className={`change-button ${isEditing.email ? "active" : ""}`}
              onClick={() =>
                isEditing.email ? handleSave("email") : handleChange("email")
              }
            >
              {isEditing.email ? "Save" : "Change"}
            </button>
          </div>

          {/* ================== PASSWORD ================== */}
          <div className="form-field">
            <div className="field-left">
              <span className="field-label">Password</span>
              {isEditing.password ? (
                <input
                  type="password"
                  name="password"
                  className="field-input"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="field-value">************</span>
              )}
            </div>

            <button
              className={`change-button ${isEditing.password ? "active" : ""}`}
              onClick={() =>
                isEditing.password
                  ? handleSave("password")
                  : handleChange("password")
              }
            >
              {isEditing.password ? "Save" : "Change"}
            </button>
          </div>

          {/* ================== PHONE ================== */}
          <div className="form-field">
            <div className="field-left">
              <span className="field-label">Phone number</span>
              {isEditing.phone ? (
                <input
                  type="tel"
                  name="phone"
                  className="field-input"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="field-value">{formData.phone}</span>
              )}
            </div>

            <button
              className={`change-button ${isEditing.phone ? "active" : ""}`}
              onClick={() =>
                isEditing.phone ? handleSave("phone") : handleChange("phone")
              }
            >
              {isEditing.phone ? "Save" : "Change"}
            </button>
          </div>

          {/* ================== ADDRESS ================== */}
          <div className="form-field">
            <div className="field-left">
              <span className="field-label">Address</span>
              {isEditing.address ? (
                <input
                  type="text"
                  name="address"
                  className="field-input"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="field-value">{formData.address}</span>
              )}
            </div>

            <button
              className={`change-button ${isEditing.address ? "active" : ""}`}
              onClick={() =>
                isEditing.address
                  ? handleSave("address")
                  : handleChange("address")
              }
            >
              {isEditing.address ? "Save" : "Change"}
            </button>
          </div>

          {/* ================== DOB ================== */}
          <div className="form-field">
            <div className="field-left">
              <span className="field-label">Date of birth</span>
              {isEditing.dateOfBirth ? (
                <input
                  type="text"
                  name="dateOfBirth"
                  className="field-input"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              ) : (
                <span className="field-value">{formData.dateOfBirth}</span>
              )}
            </div>

            <button
              className={`change-button ${isEditing.dateOfBirth ? "active" : ""}`}
              onClick={() =>
                isEditing.dateOfBirth
                  ? handleSave("dateOfBirth")
                  : handleChange("dateOfBirth")
              }
            >
              {isEditing.dateOfBirth ? "Save" : "Change"}
            </button>
          </div>

        </div>
      </div>

      <div className="subscription-section">
        <h3 className="subscription-title">구독서비스</h3>
        <p className="subscription-subtitle">신청해보세요</p>
      </div>
    </div>
  );
};

export default MyAccountPage;
