import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getSignUp } from "../../Store/User/user-action";
import { toast } from "react-toastify";
import { userActions } from "../../Store/User/user-slice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { isAuthenticated, errors, loading } = useSelector((state) => state.user || {});

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phoneNumber: "",
  });

  const { password, passwordConfirm } = user;

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      toast.error("Passwords do not match. Please verify your entries.");
      return;
    }

    dispatch(getSignUp(user));
  };

  useEffect(() => {
    if (errors) {
      const errorMessage = typeof errors === "string" ? errors : errors || "Registration failed.";
      toast.error(errorMessage);
      dispatch(userActions.clearError());
    }

    if (isAuthenticated) {
      navigate("/");
      toast.success("User registered and logged in successfully!");
    }
  }, [dispatch, isAuthenticated, errors, navigate]);

  
  const formFields = [
    { name: "name", label: "Full Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "passwordConfirm", label: "Confirm Password", type: "password", required: true },
    { name: "phoneNumber", label: "Phone Number", type: "tel", required: false },
  ];

  return (
    <>
      <div className="row wrapper justify-content-center align-items-center my-5">
        <form
          onSubmit={submitHandler}
          className="col-10 col-lg-5 p-4 shadow rounded bg-white"
        >
          <h1 className="mb-4 h3 fw-bold">Register</h1>
          
          {formFields.map((field) => (
            <div className="form-group mb-3" key={field.name}>
              <label htmlFor={`${field.name}_field`} className="form-label fw-medium">
                {field.label}
              </label>
              <input
                type={field.type}
                id={`${field.name}_field`}
                className="form-control"
                name={field.name}
                value={user[field.name]}
                required={field.required}
                onChange={onChange}
              />
            </div>
          ))}

          <button
            id="register_button"
            type="submit"
            className="btn btn-primary w-100 py-2 fw-medium loginbutton mt-3"
            disabled={loading}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Creating Account...
              </span>
            ) : (
              "REGISTER"
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default Signup;
