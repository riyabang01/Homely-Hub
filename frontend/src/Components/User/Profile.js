import React from "react";
import ProgressSteps from "../ProgressSteps";
import { Link } from "react-router-dom";
import "../../CSS/Profile.css";
import { useSelector } from "react-redux";
import LoadingSpinner from "../LoadingSpinner";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.user || {});

  const currentUserObj = user?.user || user;
  const avatarUrl = currentUserObj?.avatar?.url || user?.avatar?.url;
  const displayName = currentUserObj?.name || user?.name || "Guest";

  return (
    <>
      <ProgressSteps />
      {loading && <LoadingSpinner />}
      
      {currentUserObj && !loading && (
        
        <div className="container-fluid my-5 px-2 px-md-5">
          
          <div className="row justify-content-center w-100 mx-auto">
            
            <div 
              className="col-12 col-md-11 col-lg-11 col-xl-11 profile-card p-4 p-md-5 shadow-sm rounded bg-white"
              style={{ maxWidth: "1140px", width: "100%" }} 
            >
              <div className="row align-items-center">
                
                
                <div className="col-12 col-md-4 text-center pb-4 pb-md-0 d-flex flex-column align-items-center justify-content-center">
                  <div className="avatar-profile mb-3">
                    <img
                      className="rounded-circle border figure-img img-fluid object-fit-cover shadow-sm"
                      src={avatarUrl || "/assets/avatar.png"} 
                      alt={`${displayName}'s profile avatar`}
                      style={{ width: "150px", height: "150px", display: "block" }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/avatar.png";
                      }}
                    />
                  </div>
                  <h3 className="h4 fw-bold text-dark mt-2 mb-0">
                    Welcome, {displayName}!
                  </h3>
                </div>

                
                <div className="col-12 col-md-8 ps-md-5" style={{ borderLeft: "1px solid #eee" }}>
                  <div className="userinfo-section d-flex flex-column gap-4">
                    
                   
                    <div className="info-group pb-2">
                      <h4 className="text-muted text-uppercase fw-semibold tracking-wider mb-1" style={{ fontSize: "0.8rem" }}>
                        Full Name
                      </h4>
                      <p className="text-dark mb-0 fs-4 fw-medium">{displayName}</p>
                    </div>

                    <div className="info-group pb-2">
                      <h4 className="text-muted text-uppercase fw-semibold tracking-wider mb-1" style={{ fontSize: "0.8rem" }}>
                        Email Address
                      </h4>
                      <p className="text-dark mb-0 fs-4 fw-medium">
                        {currentUserObj?.email || user?.email}
                      </p>
                    </div>

                
                    <div className="info-group pb-2 mb-2">
                      <h4 className="text-muted text-uppercase fw-semibold tracking-wider mb-1" style={{ fontSize: "0.8rem" }}>
                        Phone Number
                      </h4>
                      <p className="text-dark mb-0 fs-4 fw-medium">
                        {currentUserObj?.phoneNumber || user?.phoneNumber || "Not Specified"}
                      </p>
                    </div>

                  
                    <div className="d-flex flex-column flex-sm-row gap-3 mt-2 w-100" style={{ maxWidth: "500px" }}>
                      <Link
                        to="/editprofile"
                        id="edit_profile"
                        className="btn btn-primary px-4 py-2 fw-medium text-white w-100 d-inline-flex justify-content-center align-items-center"
                        style={{ borderRadius: "12px", height: "46px" }}
                      >
                        Edit Profile
                      </Link>
                      <Link
                        to="/user/updatepassword"
                        className="btn btn-outline-secondary px-4 py-2 fw-medium w-100 d-inline-flex justify-content-center align-items-center"
                        style={{ borderRadius: "12px", height: "46px" }}
                      >
                        Change Password
                      </Link>
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
