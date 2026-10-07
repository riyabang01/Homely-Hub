import React from "react";
import Search from "./Search";
import Filter from "./Filter";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { propertyAction } from "../../Store/Property/property-slice";
import { getAllProperties } from "../../Store/Property/property-action";
import { Logout } from "../../Store/User/user-action";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const logout = () => {
    dispatch(Logout());
    toast.success("User has been successfully logged out!");
    navigate("/");
  };

  const allproperties = () => {
    dispatch(propertyAction.updateSearchParams({}));
    dispatch(getAllProperties());
  };

  return (
    <>
      <nav className="header row sticky-top align-items-center">
       
        <Link to="/">
          <img 
            src="/assets/logo.png" 
            alt="HomelyHub Logo" 
            className="logo" 
            onClick={allproperties} 
          />
        </Link>

        
        <div className="search_filter">
          <Search />
          <Filter />
        </div>


        {!isAuthenticated && !user && (
          <Link to="/login" aria-label="Login or Sign Up">
            <span className="material-symbols-outlined web_logo">
              account_circle
            </span>
          </Link>
        )}

        {isAuthenticated && user && (
          <div className="dropdown">
            <button
              className="btn p-0 border-0 bg-transparent dropdown-toggle web_logo d-flex align-items-center"
              type="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {user.avatar?.url ? (
                <img src="/assets/avatar.png"  className="user-img" alt="User Profile" />
              ) : (
                <span className="material-symbols-outlined">account_circle</span>
              )}
            </button>
            
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
              <li>
                <Link className="dropdown-item" to="/profile">
                  My Account
                </Link>
              </li>
              <li>
                <button className="dropdown-item" type="button" onClick={logout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};

export default Header;
