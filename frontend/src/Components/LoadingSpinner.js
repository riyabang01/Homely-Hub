import React from "react";

const LoadingSpinner = () => {
  return (
    
    <div 
      className="d-flex justify-content-center align-items-center w-100 py-5" 
      style={{ minHeight: "200px" }}
    >
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
       
        <span className="visually-hidden">Loading contents...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
