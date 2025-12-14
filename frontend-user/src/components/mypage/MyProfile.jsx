import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyProfilePhoto from "./MyProfilePhoto";
import "../../styles/components/mypage/myProfile.scss";

const MyProfile = () => {
 const { user } = useContext(AuthContext);
 const [coverImage, setCoverImage] = useState(null);

 // 랜덤 배경 이미지 생성 (사용자별로 일관된 이미지)
 useEffect(() => {
  if (!coverImage && user) {
   // 일반적인 배경 이미지 목록 (자연, 도시, 추상 등)
   const coverImages = [
     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&q=80', // 산과 호수
     'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&h=400&fit=crop&q=80', // 일몰
     'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&h=400&fit=crop&q=80', // 바다
     'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=400&fit=crop&q=80', // 숲
     'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&h=400&fit=crop&q=80', // 자연 풍경
     'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&h=400&fit=crop&q=80', // 산 풍경
     'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&h=400&fit=crop&q=80', // 강
     'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop&q=80', // 숲길
     'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200&h=400&fit=crop&q=80', // 꽃
     'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop&q=80', // 호수
     'https://images.unsplash.com/photo-1511497584788-876760111969?w=1200&h=400&fit=crop&q=80', // 도시 야경
     'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&h=400&fit=crop&q=80' // 추상 배경
   ];
   
   // 사용자 이메일을 기반으로 시드 생성하여 일관된 랜덤 이미지
   const seed = user.email || user._id || Math.random().toString();
   const imageIndex = Math.abs(seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % coverImages.length;
   
   setCoverImage(coverImages[imageIndex]);
  }
 }, [user, coverImage]);

 const handleCoverUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
   const reader = new FileReader();
   reader.onloadend = () => {
    setCoverImage(reader.result);
   };
   reader.readAsDataURL(file);
  }
 };

 return (
  <div className="my-profile">
   <div
    className="my-profile-bg"
    style={{
     backgroundImage: coverImage ? `url(${coverImage})` : undefined,
    }}
   >
    <label className="upload-cover-button">
     ☁️ Upload new cover
     <input
      type="file"
      accept="image/*"
      onChange={handleCoverUpload}
      style={{ display: "none" }}
     />
    </label>
   </div>
   <MyProfilePhoto />
   <div className="profile-info">
    <h2 className="profile-name">{user?.name || "Tomhoon"}</h2>
    <p className="profile-email">{user?.email || "gnsdl9079@gmail.com"}</p>
   </div>
  </div>
 );
};

export default MyProfile;
