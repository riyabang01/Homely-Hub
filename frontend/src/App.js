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

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.user || {});

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route 
          path="/" 
          element={loading ? null : isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} 
        />

        <Route id="login" path="/login" element={<Login />} />
        <Route id="signup" path="/signup" element={<Signup />} />
        <Route id="forgotPassword" path="/user/forgotpassword" element={<ForgotPassword />} />
        <Route id="resetPassword" path="/user/resetPassword/:token" element={<ResetPassword />} />

        <Route 
          path="/home" 
          element={loading ? null : isAuthenticated ? <Main /> : <Navigate to="/login" replace />} 
          id="main"
        >
          <Route id="home" index element={<PropertyList />} />
          <Route path="booking-success" element={<BookingSuccess />} />
          <Route id="payment" path="payment" element={<Payment />} /> 
          <Route id="updatePassword" path="user/updatepassword" element={<UpdatePassword />} />
          <Route id="profile" path="profile" element={<Profile />} />
          <Route id="editProfile" path="editprofile" element={<EditProfile />} />
        </Route>

        <Route 
          path="/propertylist/:id" 
          element={loading ? null : isAuthenticated ? <Main><PropertyDetails /></Main> : <Navigate to="/login" replace />} 
          id="propertyDetailsTopLevel" 
        />
      </>
    )
  );

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
