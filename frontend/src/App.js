import "./App.css";
import { createBrowserRouter,createRoutesFromElements,Route, RouterProvider,} from "react-router-dom";
import Main from "./Components/Home/Main";
import PropertyList from "./Components/Home/PropertyList";
import PropertyDetails from "./Components/PropertyDetails/PropertyDetails";
import Login from "./Components/User/Login";
import { Flip , ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { currentUser } from "./Store/User/user-action";
import { userActions } from "./Store/User/user-slice";
import Signup from "./Components/User/Signup";
import Profile from "./Components/User/Profile";
import EditProfile from "./Components/User/EditProfile"
import UpdatePassword from "./Components/User/UpdatePassword";

function App() {
  const dispatch =useDispatch();
  const {errors} =useSelector((state) => state.user);
  useEffect(() =>{
    if (errors){
      dispatch(userActions.clearError());
    }
    dispatch(currentUser());
  },[errors,dispatch])
  //mananges the routing configuration for the application.
  const router = createBrowserRouter (
  // creates routes from the elements passed to it.
  createRoutesFromElements (
  //defines a Route component that matches all paths "/" and renders the Main com
  //exact properties ensure that the route matches exactly what u gave in path
  <Route path="/" element={<Main />} id="main" exact>
  <Route id="home" index element={<PropertyList/>} exact/>
  <Route
     element={<PropertyDetails />}
     id="PropertyDetails"
     path="propertylist/:id"
     exact
    /> 
    <Route id="login" path="login" element={<Login/>}/>
    <Route id="signup" path="signup" element={<Signup/>}/>
    <Route id="profile" path="profile" element={<Profile/>}/>
    <Route id="editprofile" path="editprofile" element={<EditProfile/>}/>
    <Route id="updatepassword" path="user/updatepassword" element={<UpdatePassword/>}/>
  </Route>)
  );
  return (
    <div className="App">
    {/* This ensures that the rounting functionallity is available throughout the a*/}
    <RouterProvider router={router} />
    <ToastContainer
    position="bottom-center"
    autoClose={3000}
    draggable={true}
    transition={Flip}
    />
    </div>
    );
  }
  export default App;