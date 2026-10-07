import React from "react";
import { NavLink } from "react-router-dom";
import "../CSS/ProgressSteps.css"; 

const ProgressSteps = () => {

  const progressButtons = [
    { to: "/profile", text: "My Profile" },
    { to: "/booking-success", text: "My Bookings" },
  ];

  return (
    <nav className="checkout-progress d-flex justify-content-center gap-2 mt-5" role="navigation" aria-label="Profile section navigation">
      {progressButtons.map(({ to, text }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => 
            `progress-button ${isActive ? "active-button" : ""}`
          }
        >
          {text}
        </NavLink>
      ))}
    </nav>
  );
};

export default ProgressSteps;
