import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import FloatingNav from "../common/FloatingNav";
import "../../styles/layouts/WishlistLayout.scss";

const WishlistLayout = () => {
  return (
    <div className="wishlist-layout">
      <Header />
      <main className="wishlist-content">
        <Outlet />
      </main>
      <Footer />
      <FloatingNav />
    </div>
  );
};

export default WishlistLayout;

