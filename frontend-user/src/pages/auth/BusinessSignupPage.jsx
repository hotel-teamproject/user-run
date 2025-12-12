import BusinessSignupForm from "../../components/auth/BusinessSignupForm";
import AuthImageWrap from "../../components/auth/AuthImageWrap";

const BusinessSignupPage = () => {
  return (
    <div className="auth-layout-page">
      <div className="auth-layout-container">
        <div className="auth-layout-content">
          <div className="auth-layout-form-section">
            <BusinessSignupForm />
          </div>

          <div className="auth-layout-image-section">
            <AuthImageWrap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignupPage;
