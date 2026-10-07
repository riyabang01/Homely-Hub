import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../Store/User/user-action";
import { toast } from "react-toastify";
import "../../CSS/Profile.css"; 

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");


  const { loading } = useSelector((state) => state.user || {});

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
     
      await dispatch(forgotPassword({ email }));
      
      toast.success(`Password recovery link sent successfully to: ${email}`);
      setEmail(""); 
    } catch (error) {
      console.error("Forgot password execution error:", error);
      toast.error("Failed to process request. Please verify your email and try again.");
    }
  };

  return (
    <div className="row wrapper justify-content-center align-items-center my-5" style={{ minHeight: "60vh" }}>
      <div className="col-10 col-lg-5 p-4 shadow rounded bg-white">
        <form onSubmit={submitHandler}>
          <h1 className="mt-2 mb-4 h3 fw-bold text-center text-md-start">Forgot Password</h1>
          
          <p className="text-muted small mb-4">
            Enter the email address associated with your HomelyHub account, and we'll send you a link to securely reset your password.
          </p>

          <div className="form-group mb-4">
            <label htmlFor="email_field" className="form-label fw-medium">
              Email Address
            </label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-medium update-btn py-2"
            disabled={loading}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Processing...
              </span>
            ) : (
              "Send Recovery Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
