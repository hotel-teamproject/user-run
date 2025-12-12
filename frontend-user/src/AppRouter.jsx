import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import MyPageLayout from "./components/layouts/MyPageLayout";
import SearchLayout from "./components/layouts/SearchLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AddPaymentPage from "./pages/payment/AddPaymentPage";

// pages
import HomePage from "./pages/home/HomePage";
import SearchPage from "./pages/search/SearchPage";
import HotelListPage from "./pages/search/HotelListPage";
import HotelDetailPage from "./pages/hotel/HotelDetailPage";

import BookingStepLayout from "./pages/booking/BookingStepLayout";
import BookingStepDates from "./pages/booking/BookingStepDates";
import BookingStepRoom from "./pages/booking/BookingStepRoom";
import BookingStepExtras from "./pages/booking/BookingStepExtras";
import BookingStepPayment from "./pages/booking/BookingStepPayment";
import BookingComplete from "./pages/booking/BookingComplete";

import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import BusinessSignupPage from "./pages/auth/BusinessSignupPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import KakaoCallbackPage from "./pages/auth/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/auth/GoogleCallbackPage";

import MyOverviewPage from "./pages/mypage/MyOverviewPage";
import MyAccountPage from "./pages/mypage/MyAccountPage";
import MyPaymentPage from "./pages/mypage/MyPaymentPage";
import ProfilePage from "./pages/mypage/ProfilePage";
import MyBookingsPage from "./pages/mypage/MyBookingsPage";
import MyBookingDetailPage from "./pages/mypage/MyBookingDetailPage";
import MyReviewsPage from "./pages/mypage/MyReviewsPage";
import WishlistPage from "./pages/mypage/WishlistPage";
import MyCouponsPage from "./pages/mypage/MyCouponsPage";
import MyPointsPage from "./pages/mypage/MyPointsPage";
import MyInquiriesPage from "./pages/mypage/MyInquiriesPage";

import FaqPage from "./pages/support/FaqPage";
import NoticeListPage from "./pages/support/NoticeListPage";
import NoticeDetailPage from "./pages/support/NoticeDetailPage";
import ContactPage from "./pages/support/ContactPage";
import SupportPage from "./pages/support/SupportPage";

import NotFoundPage from "./pages/common/NotFoundPage";

const AppRouter = () => {
 return (
  <BrowserRouter>
   <Routes>
    {/* main landing */}
    <Route path="/" element={<MainLayout />}>
     <Route index element={<HomePage />} />
         {/* 호텔 리스트 */}
     <Route path="hotels">
      <Route index element={<HotelListPage />} />
      <Route path=":hotelId" element={<HotelDetailPage />} />
     </Route>
    </Route>

    {/* 검색 레이아웃 */}
    <Route element={<SearchLayout />}>
     <Route path="search" element={<SearchPage />} />
    </Route>


    {/* 예약 플로우 - 로그인 필요 */}
    <Route
     path="booking/:hotelId"
     element={
      <ProtectedRoute>
       <BookingStepLayout />
      </ProtectedRoute>
     }
    >
     {/* /booking/:hotelId */}
     <Route index element={<BookingStepDates />} />
     {/* /booking/:hotelId/room */}
     <Route path="room" element={<BookingStepRoom />} />
     {/* /booking/:hotelId/extras */}
     <Route path="extras" element={<BookingStepExtras />} />
     {/* /booking/:hotelId/payment */}
     <Route path="payment" element={<BookingStepPayment />} />
     {/* /booking/:hotelId/complete */}
     <Route path="complete" element={<BookingComplete />} />
    </Route>

    {/* 고객센터 / 공지 / FAQ / 문의 */}
    <Route path="support">
     <Route index element={<SupportPage />} />
     <Route path="faq" element={<FaqPage />} />
     <Route path="notices" element={<NoticeListPage />} />
     <Route path="notices/:noticeId" element={<NoticeDetailPage />} />
     <Route path="contact" element={<ContactPage />} />
    </Route>

    {/* 마이페이지 - 로그인 필요 */}
    <Route
     path="mypage"
     element={
      <ProtectedRoute>
       <MyPageLayout />
      </ProtectedRoute>
     }
    >
     <Route index element={<MyAccountPage />} />
     <Route path="account" element={<MyAccountPage />} />
     <Route path="bookings">
      <Route index element={<MyBookingsPage />} />
      <Route path=":bookingId" element={<MyBookingDetailPage />} />
     </Route>
     <Route path="payment" element={<MyPaymentPage />} />

     {/* 기존 라우트들 (필요시 제거 가능) */}
     <Route path="profile" element={<ProfilePage />} />
     <Route path="reviews" element={<MyReviewsPage />} />
     <Route path="wishlist" element={<WishlistPage />} />
     <Route path="coupons" element={<MyCouponsPage />} />
     <Route path="points" element={<MyPointsPage />} />
     <Route path="inquiries" element={<MyInquiriesPage />} />
    </Route>

    {/* 인증 레이아웃: 헤더 최소, 센터 정렬 등 */}
    <Route element={<AuthLayout />}>
     <Route path="login" element={<LoginPage />} />
     <Route path="signup" element={<SignupPage />} />
     <Route path="business-signup" element={<BusinessSignupPage />} />
     <Route path="reset-password" element={<ResetPasswordPage />} />
     <Route path="add-payment" element={<AddPaymentPage />} />

     {/* 소셜 로그인 콜백 (카카오, 구글) */}
     <Route path="oauth">
      <Route path="kakao/callback" element={<KakaoCallbackPage />} />
      <Route path="google/callback" element={<GoogleCallbackPage />} />
     </Route>
    </Route>

    {/* 편의용 별칭: /wishlist -> /mypage/wishlist */}
    <Route path="wishlist" element={<Navigate to="/mypage/wishlist" replace />} />

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
   </Routes>
  </BrowserRouter>
 );
};

export default AppRouter;