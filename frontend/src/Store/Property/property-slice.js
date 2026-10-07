import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  properties: [],
  totalProperties: 0,
  searchParams: {}, 
  error: null, 
  loading: false, 
};

const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    
    getRequest(state) {
      state.loading = true;
      state.error = null; 
    },
    
   
    getProperties(state, action) {
     
      state.properties = action.payload?.data || [];
      state.totalProperties = action.payload?.all_properties || 0;
      state.loading = false;
    },
    
    
    updateSearchParams: (state, action) => {
      if (Object.keys(action.payload).length === 0) {
        
        state.searchParams = {};
      } else {
      
        state.searchParams = {
          ...state.searchParams,
          ...action.payload,
        };
      }
    },

   
    getErrors(state, action) {
      state.error = action.payload;
      state.loading = false; 
    },


    clearPropertyErrors(state) {
      state.error = null;
    }
  },
});


export const propertyAction = propertySlice.actions;


export default propertySlice.reducer;
