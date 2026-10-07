import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/rent/user/booking", {
          withCredentials: true
        });

        if (response.data && response.data.bookings) {
          setAllBookings(response.data.bookings);
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load database profiles.");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
        <h2>Loading bookings from database...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif", color: "red" }}>
        <h2>{error}</h2>
        <button onClick={() => navigate("/")} style={btnStyle}>Go to Home Page</button>
      </div>
    );
  }

  if (allBookings.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
        <h2>No bookings found yet!</h2>
        <button onClick={() => navigate("/")} style={btnStyle}>Go to Home Page</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "center", color: "#27ae60", marginBottom: "30px" }}>
        <h1>All Bookings</h1>
        <p>Here is the information for all your bookings.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {allBookings.map((booking, index) => (
          <div 
            key={booking._id || index} 
            style={{ border: "1px solid #e0e0e0", padding: "20px", borderRadius: "8px", backgroundColor: "#fff", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, color: "#27ae60" }}>Booking #{allBookings.length - index}</h3>
              <span style={{ fontSize: "12px", color: "#95a5a6" }}>ID: {booking._id}</span>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <h4 style={{ color: "#348de6", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Property Details</h4>
                <p><b>Name:</b> {booking.property?.propertyName || "N/A"}</p>
                <p>
                  <b>Address: </b> 
                  {typeof booking.property?.address === "object" && booking.property?.address !== null ? (
                    `${booking.property.address.area ? booking.property.address.area + ", " : ""}${booking.property.address.city || ""}, ${booking.property.address.state || ""}`
                  ) : (
                    booking.property?.address || "N/A"
                  )}
                </p>
              </div>
              
              <div>
                <h4 style={{ color: "#34495e", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>Guest Details</h4>
                <p><b>Total Guests:</b> {booking.guests || 1}</p>
                <p><b>Price Per Night:</b> ₹ {booking.property?.price || "N/A"}</p>
              </div>
            </div>

            <hr style={{ border: "0", borderTop: "1px solid #f1f1f1", margin: "15px 0" }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "4px 0" }}><b>Check-in:</b> {booking.fromDate ? new Date(booking.fromDate).toLocaleDateString() : "N/A"}</p>
                <p style={{ margin: "4px 0" }}><b>Check-out:</b> {booking.toDate ? new Date(booking.toDate).toLocaleDateString() : "N/A"}</p>
                <p style={{ margin: "4px 0" }}><b>Total Nights:</b> {booking.numberOfNights || "N/A"}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "20px", color: "#e67e22", fontWeight: "bold" }}>
                  Total Price: ₹ {booking.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/")} style={{ ...btnStyle, width: "100%", marginTop: "30px" }}>
        Book Another Place
      </button>
    </div>
  );
};

const btnStyle = {
  padding: "12px 24px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold"
};

export default BookingSuccess;
