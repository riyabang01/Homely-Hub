import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  propertydetails: {}, 
  loading: false,
  error: null,
};

const propertyDetailsSlice = createSlice({
  name: "propertyDetails",
  initialState,
  reducers: {
   
    getListRequest(state) {
      state.loading = true;
      state.error = null; 
      state.propertydetails = {}; 
    },
    

    getPropertyDetails(state, action) {
      state.propertydetails = action.payload || {};
      state.loading = false;
    },
    

    getErrors(state, action) {
      state.error = action.payload;
      state.loading = false; 
    },

    
    clearDetailsErrors(state) {
      state.error = null;
    }
  },
});


export const propertyDetailsAction = propertyDetailsSlice.actions;


export default propertyDetailsSlice.reducer;
