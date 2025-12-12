import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import FloatingNav from "../common/FloatingNav";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />

      <FloatingNav />
    </div>
  );
};

export default MainLayout;
