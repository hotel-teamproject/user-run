import SignupForm from "../../components/auth/SignupForm";
import AuthImageWrap from "../../components/auth/AuthImageWrap";

const SignupPage = () => {
  return (
    <div className="auth-layout-page">
      <div className="auth-layout-container">
        <div className="auth-layout-content">
          <div className="auth-layout-form-section">
            <SignupForm />
          </div>
          <div className="auth-layout-image-section">
            <AuthImageWrap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

