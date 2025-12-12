import Header from "../../components/common/Header";
import Footer from "../../components/common/Footer";
import FloatingNav from "../../components/common/FloatingNav";
import StepNavigation from "./StepNavigation";
import "../../styles/pages/booking/BookingStepLayout.scss";
import { Outlet } from "react-router-dom";

const BookingStepLayout = () => {
  return (
    <div className="booking-page-layout">
      <Header />

      <div className="booking-layout">
        <StepNavigation />

        <div className="booking-content">
          <Outlet />
        </div>
      </div>

      <Footer />
      <FloatingNav />
    </div>
  );
};

export default BookingStepLayout;
