import React from "react";
import "../../CSS/Home.css";

const Footer = () => {
  
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed-bottom bg-white p-2">
      <p> © {currentYear} All Rights Reserved.</p>
      
      <ul className="footerlist">
        <li>Privacy</li>
        <li>Terms</li>
        <li>Sitemap</li>
        <li>Company details</li>
      </ul>
      
      <p>English (IN) INR</p>
    </footer>
  );
};

export default Footer;
