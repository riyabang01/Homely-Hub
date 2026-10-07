import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../Store/User/user-action";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../../CSS/Profile.css";

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
 
  const { user, loading } = useSelector((state) => state.user || {});

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("/assets/avatar.png");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || ""); 
      setPhoneNumber(user.phoneNumber || "");
      setAvatarPreview(user.avatar?.url || "/assets/avatar.png");
      setAvatar(user.avatar?.url || "");
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Name field cannot be left blank.");
      return;
    }

    try {
      
      await dispatch(updateUser({ name, phoneNumber, avatar }));
      
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Profile dispatch modification failure: ", error);
      toast.error("Failed to update profile changes. Please try again.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    
    
    if (!file) return;

    
    if (file.size > 20480) {
      toast.warning("Selected profile image file size should be less than 20kb.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="row wrapper justify-content-center my-5">
      {user && (
        <div className="col-10 col-lg-5 updateprofile p-4 shadow rounded bg-white">
          <form onSubmit={handleUpdate} encType="multipart/form-data">
            <h1 className="mt-2 mb-4 h3 fw-bold">Update Profile</h1>
            
            <div className="form-group mb-3">
              <label htmlFor="name_field" className="form-label fw-medium">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="phonenumber_field" className="form-label fw-medium">Phone Number</label>
              <input
                type="tel"
                id="phonenumber_field"
                className="form-control"
                value={phoneNumber}
                pattern="[0-9]*"
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="avatar_update" className="form-label fw-medium d-block">Avatar</label>
              <div className="d-flex align-items-center gap-3">
                <div className="avatar">
                  <img
                    src={avatarPreview}
                    className="rounded-circle object-fit-cover border"
                    style={{ width: "60px", height: "60px" }}
                    alt="Avatar Preview"
                  />
                </div>
                
                <div className="custom-file flex-grow-1">
                  <input
                    type="file"
                    name="avatar"
                    className="form-control"
                    id="avatar_update"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <small className="text-muted d-block mt-1 notes">
                    (Image size should be less than 20kb)
                  </small>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 fw-medium update-btn"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
