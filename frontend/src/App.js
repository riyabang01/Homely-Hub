import "./App.css";
import React, { useEffect } from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Main from "./Components/Home/Main";
import PropertyList from "./Components/Home/PropertyList";
import PropertyDetails from "./Components/PropertyDetails/PropertyDetails";
import BookingSuccess from './Components/PropertyDetails/BookingSuccess';
import Payment from "./Payment/payment"; 

import Login from "./Components/User/Login";
import Signup from "./Components/User/Signup";
import Profile from "./Components/User/Profile";
import EditProfile from "./Components/User/EditProfile";
import UpdatePassword from "./Components/User/UpdatePassword";
import ForgotPassword from "./Components/User/ForgotPassword"; 
import ResetPassword from "./Components/User/ResetPassword";   

import { currentUser } from "./Store/User/user-action";

const RootRedirect = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.user || { isAuthenticated: false, loading: false });

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#fff" }}>
        <h2>Connecting to HomelyHub...</h2>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};

const ProtectedElement = ({ element: Element }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user || { isAuthenticated: false, loading: false });

  if (loading) return null;
  return isAuthenticated ? <Element /> : <Navigate to="/login" replace />;
};

const PublicElement = ({ element: Element }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user || { isAuthenticated: false, loading: false });

  if (loading) return null;
  return isAuthenticated ? <Navigate to="/home" replace /> : <Element />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootRedirect />} />

      <Route id="login" path="/login" element={<PublicElement element={Login} />} />
      <Route id="signup" path="/signup" element={<PublicElement element={Signup} />} />
      <Route id="forgotPassword" path="/user/forgotpassword" element={<ForgotPassword />} />
      <Route id="resetPassword" path="/user/resetPassword/:token" element={<ResetPassword />} />

      <Route path="/home" element={<ProtectedElement element={Main} />}>
        <Route index element={<PropertyList />} />
      </Route>

      <Route path="/profile" element={<ProtectedElement element={Main} />}>
        <Route index element={<Profile />} />
      </Route>

      <Route path="/editprofile" element={<ProtectedElement element={Main} />}>
        <Route index element={<EditProfile />} />
      </Route>

      <Route path="/user/updatepassword" element={<ProtectedElement element={Main} />}>
        <Route index element={<UpdatePassword />} />
      </Route>

      <Route path="/booking-success" element={<ProtectedElement element={Main} />}>
        <Route index element={<BookingSuccess />} />
      </Route>

      <Route path="/payment" element={<ProtectedElement element={Main} />}>
        <Route index element={<Payment />} />
      </Route>

      <Route path="/propertylist" element={<ProtectedElement element={Main} />}>
        <Route path=":id" element={<PropertyDetails />} />
      </Route>
    </>
  )
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        draggable={true}
        transition={Flip}
        theme="colored"
      />
    </div>
  );
}

export default App;
