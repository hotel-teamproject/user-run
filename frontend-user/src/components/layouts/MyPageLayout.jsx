import { Outlet, useLocation } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import MyPageNav from "../mypage/MypageNav";
import MyProfile from "../mypage/MyProfile";
import FloatingNav from "../common/FloatingNav";

const MyPageLayout = () => {
 const location = useLocation();
 const isBookingDetailPage = location.pathname.includes("/mypage/bookings/") && 
                              location.pathname !== "/mypage/bookings";

 return (
  <div className="mypage-layout ">
   <Header />

   {!isBookingDetailPage && (
    <div className="hero inner">
     <MyProfile />
    </div>
   )}
   <div className="mypage-container inner">
    {!isBookingDetailPage && <MyPageNav />}
    <main className="mypage-content">
     <Outlet />
    </main>
   </div>

   <Footer />

   <FloatingNav />
  </div>
 );
};

export default MyPageLayout;
