import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const processPayment = createAsyncThunk(
  "payment/processPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      
      const { data } = await axios.post(
        "/api/v1/payment/process",
        paymentData,
        config
      );

      
      return data;
    } catch (error) {
      
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message || "An unexpected error occurred during payment processing.";
          
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchStripeApiKey = createAsyncThunk(
  "payment/fetchStripeApiKey",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("/api/v1/stripeapi");
      
     
      return data.stripeApiKey;
    } catch (error) {
      const errorMessage =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message || "Could not retrieve the payment system keys.";
          
      return rejectWithValue(errorMessage);
    }
  }
);
