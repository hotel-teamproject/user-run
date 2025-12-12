import { Outlet } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import MyPageNav from "../mypage/MypageNav";
import MyProfile from "../mypage/MyProfile";
import FloatingNav from "../common/FloatingNav";

const MyPageLayout = () => {
 return (
  <div className="mypage-layout ">
   <Header />

   <div className="hero inner">
    <MyProfile />
   </div>
   <div className="mypage-container inner">
    <MyPageNav />
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
