import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../../Store/User/user-slice";
import { updatePassword } from "../../Store/User/user-action";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [passwordCurrent, setPasswordCurrent] = useState(""); 
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const { errors, success, loading } = useSelector((state) => state.user || {});

  const submitHandler = (e) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match. Please verify your entries.");
      return;
    }

    dispatch(updatePassword({ passwordConfirm, password, passwordCurrent }));
  };

  useEffect(() => {
    if (errors) {
      const errorMessage = typeof errors === "string" ? errors : errors || "Failed to update password.";
      toast.error(errorMessage);
      dispatch(userActions.clearError());
    }

    if (success) {
      toast.success("Password has been updated successfully!");
      navigate("/profile");
      
      
      dispatch(userActions.getPasswordSuccess(false));
    }
  }, [errors, success, dispatch, navigate]);

  return (
    <>
      <div className="row wrapper justify-content-center align-items-center my-5">
        <div className="col-10 col-lg-5 updateprofile p-4 shadow rounded bg-white">
          <form onSubmit={submitHandler}>
            <h1 className="password_title mb-4 h3 fw-bold">Update Password</h1>
            
            <div className="form-group mb-3">
              <label htmlFor="passwordCurrent_field" className="form-label fw-medium">
                Current Password
              </label>
              <input
                type="password"
                id="passwordCurrent_field"
                className="form-control"
                value={passwordCurrent}
                required
                onChange={(e) => setPasswordCurrent(e.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="new_password_field" className="form-label fw-medium">
                New Password
              </label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={password}
                required
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="new_password_confirm_field" className="form-label fw-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                id="new_password_confirm_field"
                className="form-control"
                value={passwordConfirm}
                required
                minLength={6}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 fw-medium password-btn"
              disabled={loading}
            >
              {loading ? (
                <span className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
