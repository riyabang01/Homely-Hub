import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";


const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  const bookingSummary = location.state || {};
  const { totalPrice = 0, propertyName = "Property Stay", checkinDate, checkoutDate } = bookingSummary;

  const { user } = useSelector((state) => state.user || {});
  const [loading, setLoading] = useState(false);

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: user?.name || "",
  });

  useEffect(() => {
    
    if (!totalPrice) {
      toast.warn("No active booking session found.");
      navigate("/");
    }
  }, [totalPrice, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    

    if (cardData.cardNumber.replace(/\s/g, "").length !== 16) {
      toast.error("Please enter a valid 16-digit card number.");
      return;
    }

    if (cardData.cvv.length !== 3) {
      toast.error("CVV must be exactly 3 digits.");
      return;
    }

    setLoading(true);

    try {
      const paymentPayload = {
        bookingDetails: bookingSummary,
        paymentMethod: "Credit/Debit Card",
        amountPaid: totalPrice,
        holderName: cardData.cardHolderName,
      };

      console.log("Processing Gate Checkout: ", paymentPayload);
      
     
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Payment successful! Your stay has been confirmed.");
      navigate("/user/booking");
    } catch (error) {
      console.error("Payment Gateway processing failure:", error);
      toast.error("Transaction declined. Please verify your payment details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row wrapper justify-content-center align-items-center my-5">
      <div className="col-10 col-lg-5 p-4 shadow rounded bg-white">
        <form onSubmit={handlePaymentSubmit}>
          <h1 className="mb-4 h3 fw-bold text-center">Secure Checkout</h1>

          
          <div className="card bg-light border-0 mb-4 p-3 rounded">
            <h2 className="h6 fw-bold mb-2 text-uppercase text-muted">Summary</h2>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-medium text-dark">{propertyName}</span>
              <span className="fw-bold text-primary">₹ {totalPrice}</span>
            </div>
            {checkinDate && checkoutDate && (
              <small className="text-muted d-block mt-1">
                Dates: {checkinDate} to {checkoutDate}
              </small>
            )}
          </div>

        
          <div className="form-group mb-3">
            <label htmlFor="cardHolderName" className="form-label fw-medium">Cardholder Name</label>
            <input
              type="text"
              id="cardHolderName"
              name="cardHolderName"
              className="form-control"
              placeholder="As printed on card"
              value={cardData.cardHolderName}
              required
              onChange={handleInputChange}
            />
          </div>

         
          <div className="form-group mb-3">
            <label htmlFor="cardNumber" className="form-label fw-medium">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              className="form-control"
              placeholder="1234 5678 9101 1121"
              maxLength="16"
              pattern="[0-9]{16}"
              value={cardData.cardNumber}
              required
              onChange={handleInputChange}
            />
          </div>

          
          <div className="row">
            <div className="col-6 mb-4">
              <div className="form-group">
                <label htmlFor="expiryDate" className="form-label fw-medium">Expiry Date</label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  className="form-control"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={cardData.expiryDate}
                  required
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="col-6 mb-4">
              <div className="form-group">
                <label htmlFor="cvv" className="form-label fw-medium">CVV</label>
                <input
                  type="password"
                  id="cvv"
                  name="cvv"
                  className="form-control"
                  placeholder="•••"
                  maxLength="3"
                  pattern="[0-9]{3}"
                  value={cardData.cvv}
                  required
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-medium mt-2 shadow-sm"
            disabled={loading}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Authorizing Transaction...
              </span>
            ) : (
              `Pay Now ₹ ${totalPrice}`
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
