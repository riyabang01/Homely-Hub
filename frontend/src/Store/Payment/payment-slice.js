import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  success: false,
  error: null,
  transactionInfo: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {

    paymentRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },

    paymentSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      state.transactionInfo = action.payload;
    },

    paymentFail: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    resetPaymentState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.transactionInfo = null;
    },
  },
});


export const paymentActions = paymentSlice.actions;


export default paymentSlice.reducer;
