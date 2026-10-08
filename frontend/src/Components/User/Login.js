import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "../../CSS/Login.css";
import { getLogIn } from "../../Store/User/user-action";
import { userActions } from "../../Store/User/user-slice";
import LoadingSpinner from "../LoadingSpinner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isAuthenticated, errors, loading } = useSelector(
    (state) => state.user || {}
  );

  const submitHandler = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all layout field values.");
      return;
    }
    dispatch(getLogIn({ email, password }));
  };

  useEffect(() => {
    if (errors) {
      
      const errorMessage = typeof errors === "string" ? errors : errors[0] || "Invalid login credentials.";
      toast.error(errorMessage);
      
      
      dispatch(userActions.clearError());
    }

    if (isAuthenticated) {
      navigate("/");
      toast.success("User has logged in successfully!");
    }
  }, [isAuthenticated, errors, navigate, dispatch]);

  return (
    <>
      <div className="row wrapper justify-content-center align-items-center my-5">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="col-10 col-lg-5 p-4 shadow rounded bg-white">
            <form onSubmit={submitHandler}>
              <h1 className="mb-4 h3 fw-bold">Login</h1>
              
              <div className="form-group mb-3">
                <label htmlFor="email_field" className="form-label fw-medium">Email Address</label>
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

              <div className="form-group mb-3">
                <label htmlFor="password_field" className="form-label fw-medium">Password</label>
                <input
                  type="password"
                  id="password_field"
                  className="form-control"
                  placeholder="••••••••"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Link to="/signup" className="small text-decoration-none">
                  New user? Register here
                </Link>
                <Link to="/user/forgotpassword" className="small text-decoration-none text-muted">
                  Forgot Password?
                </Link>
              </div>

              <button
                id="login_button"
                type="submit"
                className="btn btn-primary w-100 py-2 fw-medium loginbutton"
                disabled={loading}
              >
                LOGIN
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
