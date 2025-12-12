import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import MyProfilePhoto from "./MyProfilePhoto";
import "../../styles/components/mypage/myProfile.scss";

const MyProfile = () => {
 const { user } = useContext(AuthContext);
 const [coverImage, setCoverImage] = useState(null);

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
