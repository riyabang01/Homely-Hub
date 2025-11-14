import React from 'react'
//Outlet is used to render the content of nested routes
import {Outlet} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

//Arrow Function
const Main = () => {
  return (
    <div>
      {/* Rendering the header component */}
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Main;