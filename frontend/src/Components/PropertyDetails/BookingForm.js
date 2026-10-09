import React, { useState } from "react";
import moment from "moment";
import { DatePicker, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const BookingForm = ({
  price,
  propertyName,
  address,
  maximumGuest,
  propertyId,
  currentBookings = [],
}) => {
  const [paymentData, setPaymentData] = useState({});
  const [userData, setUserData] = useState({ totalGuests: "", name: "", phoneNo: "" });
  const [isBooking, setIsBooking] = useState(false); 
  
  const { RangePicker } = DatePicker;
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user || {});
  const currentUserId = user?.user?._id || user?._id;

  const handleFilterChange = (keyName, value) => {
    setPaymentData((prevData) => ({
      ...prevData,
      [keyName]: value,
    }));
  };

  const handleDateChange = (dates) => {
    if (!dates || !dates[0] || !dates[1]) {
      handleFilterChange("checkinDate", null);
      handleFilterChange("checkoutDate", null);
      handleFilterChange("nights", 0);
      handleFilterChange("totalPrice", 0);
      return;
    }

    const startMoment = moment(dates[0].valueOf());
    const endMoment = moment(dates[1].valueOf());

    const calculatedNights = endMoment.diff(startMoment, "days");
    const calculatedTotalPrice = price * calculatedNights;

    const dbCheckinString = startMoment.format("YYYY-MM-DD");
    const dbCheckoutString = endMoment.format("YYYY-MM-DD");

    handleFilterChange("checkinDate", dbCheckinString);
    handleFilterChange("checkoutDate", dbCheckoutString);
    handleFilterChange("nights", calculatedNights);
    handleFilterChange("totalPrice", calculatedTotalPrice);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true); 

    const guestCount = Number(userData.totalGuests);

    const finalBookingDetails = {
      property: propertyId,
      user: currentUserId,
      price: paymentData.totalPrice || 0,
      fromDate: paymentData.checkinDate,
      toDate: paymentData.checkoutDate,
      guests: guestCount,
      totalGuests: guestCount,
      numberOfNights: paymentData.nights || 0,
      paid: true
    };

    try {
      const response = await axios.post("/api/v1/rent/user/booking/new", finalBookingDetails, {
        withCredentials: true
      });

      if (response.data.status === "success" || response.status === 200) {
        const savedBooking = response.data.booking || {};
        
        const localBackup = {
          id: savedBooking._id || Date.now(),
          propertyName,
          address,
          name: userData.name || user?.name,
          phoneNo: userData.phoneNo || user?.phoneNumber,
          checkinDate: paymentData.checkinDate,
          checkoutDate: paymentData.checkoutDate,
          nights: paymentData.nights,
          totalPrice: paymentData.totalPrice,
          totalGuests: Number(savedBooking.guests) || Number(savedBooking.totalGuests) || guestCount,
          guests: Number(savedBooking.guests) || Number(savedBooking.totalGuests) || guestCount
        };

        const existingBookings = JSON.parse(localStorage.getItem("allBookings")) || [];
        existingBookings.unshift(localBackup);
        localStorage.setItem("allBookings", JSON.stringify(existingBookings));

        setTimeout(() => {
          navigate("/booking-success");
        }, 1000);
      }
    } catch (error) {
      console.error("Database Save Failed:", error);
      alert(error.response?.data?.message || "Something went wrong with the database connection.");
      setIsBooking(false);
    }
  };

  return (
    <div className="form-container">
      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="price-pernight">
          <b>₹ {price}</b> <span> / per night</span>
        </div>
        
        <div className="payment-field">
          <div className="date">
            <Space direction="vertical" size="12">
              <RangePicker 
                format="DD-MM-YYYY" 
                onChange={handleDateChange} 
              />
            </Space>
          </div>

          <div className="guest">
            <label className="payment-labels">Number of Guests: </label>
            <br />
            <input
              className="no-of-guest"
              placeholder="Number Of Guests"
              type="number"
              min="1"
              max={maximumGuest}
              value={userData.totalGuests}
              required
              onChange={(e) => {
                const val = e.target.value;
                setUserData((prev) => ({ ...prev, totalGuests: val }));
              }}
            />
          </div>

          <div className="name-phoneno">
            <label className="payment-labels">Your Full Name: </label>
            <br />
            <input
              type="text"
              className="full-name"
              placeholder="Name"
              value={userData.name}
              required
              minLength="3"
              onChange={(e) => {
                const val = e.target.value;
                setUserData((prev) => ({ ...prev, name: val }));
              }}
            />
            <br />
            <label className="payment-labels">Phone Number:</label>
            <br />
            <input
              type="tel"
              className="phone-number"
              placeholder="Number"
              maxLength="10"
              value={userData.phoneNo}
              required
              pattern="[0-9]{10}"
              onChange={(e) => {
                const val = e.target.value;
                setUserData((prev) => ({ ...prev, phoneNo: val }));
              }}
            />
          </div>
        </div>

        <div className="book-place">
          <button type="submit" disabled={isBooking} className={isBooking ? "booked-btn" : "book-btn"}>
            {isBooking ? "✓ Booked" : `Book this place ₹ ${paymentData["totalPrice"] || 0}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
