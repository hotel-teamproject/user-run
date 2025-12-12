import { Outlet } from "react-router-dom";
import FloatingNav from "../common/FloatingNav";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      {children || <Outlet />}
      <FloatingNav />
    </div>
  );
};

export default AuthLayout;
