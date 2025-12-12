import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const MyProfilePhoto = () => {
 const { user, setUser } = useContext(AuthContext);
 const [previewImage, setPreviewImage] = useState(user?.profileImage);

 const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
   const reader = new FileReader();
   reader.onloadend = () => {
    setPreviewImage(reader.result);
    // user 정보 업데이트
    const updatedUser = { ...user, profileImage: reader.result };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
   };
   reader.readAsDataURL(file);
  }
 };

 return (
  <div className="my-profile-photo">
   {previewImage ? (
    <img src={previewImage} alt="Profile" className="profile-image" />
   ) : (
    <div className="profile-placeholder">{user?.name?.charAt(0) || "T"}</div>
   )}
   <label className="edit-photo-button">
    ✏️
    <input
     type="file"
     accept="image/*"
     onChange={handleImageUpload}
     style={{ display: "none" }}
    />
   </label>
  </div>
 );
};

export default MyProfilePhoto;
