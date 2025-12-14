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

 const handleImageDelete = () => {
  setPreviewImage(null);
  const updatedUser = { ...user, profileImage: null };
  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
 };

 return (
  <div className="my-profile-photo-wrapper">
   <div className="my-profile-photo">
    {previewImage ? (
     <img src={previewImage} alt="Profile" className="profile-image" />
    ) : (
     <div className="profile-placeholder">{user?.name?.charAt(0) || "T"}</div>
    )}
   </div>
   <div className="profile-photo-actions">
    <label className="profile-action-btn profile-add-btn">
     추가
     <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      style={{ display: "none" }}
     />
    </label>
    {previewImage && (
     <button
      className="profile-action-btn profile-delete-btn"
      onClick={handleImageDelete}
     >
      삭제
     </button>
    )}
   </div>
  </div>
 );
};

export default MyProfilePhoto;
