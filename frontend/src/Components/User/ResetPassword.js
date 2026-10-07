import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../../Store/User/user-action";
import { toast } from "react-toastify";
import "../../CSS/Login.css"; 

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

 
  const { loading } = useSelector((state) => state.user || {});

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please verify your fields.");
      return;
    }

    try {
      
      await dispatch(resetPassword({ token, password, confirmPassword }));
      
      toast.success("Password updated successfully! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      console.error("Reset password process failure: ", error);
      toast.error("Token is invalid or has expired. Please request a new recovery link.");
    }
  };

  return (
    <div className="row wrapper justify-content-center align-items-center my-5" style={{ minHeight: "60vh" }}>
      <div className="col-10 col-lg-5 p-4 shadow rounded bg-white">
        <form onSubmit={submitHandler}>
          <h1 className="mb-4 h3 fw-bold">Reset Password</h1>

          <div className="form-group mb-3">
            <label htmlFor="password_field" className="form-label fw-medium">
              New Password
            </label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              placeholder="Minimum 6 characters"
              value={password}
              required
              minLength={6}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group mb-4">
            <label htmlFor="confirm_password_field" className="form-label fw-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              placeholder="Re-enter password"
              value={confirmPassword}
              required
              minLength={6}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-medium loginbutton"
            disabled={loading}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Saving Password...
              </span>
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
