import React from "react";
import PaymentForm from "../../components/payment/PaymentForm";
import AuthImageWrap from "../../components/auth/AuthImageWrap";

const AddPaymentPage = () => {
  return (
    <div className="auth-layout-page">
      <div className="auth-layout-container">
        <div className="auth-layout-content">
          <div className="auth-layout-form-section">
            <PaymentForm />
          </div>
          <div className="auth-layout-image-section">
            <AuthImageWrap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentPage;

