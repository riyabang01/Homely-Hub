import { configureStore } from "@reduxjs/toolkit";

import propertyReducer from "./Property/property-slice";
import propertyDetailsReducer from "./PropertyDetails/propertyDetails-slice";
import userReducer from "./User/user-slice";
import paymentReducer from "./Payment/payment-slice"; 

const store = configureStore({
  reducer: {
    
    properties: propertyReducer,
    propertydetails: propertyDetailsReducer,
    user: userReducer,
    payment: paymentReducer, 
  },
  
});

export default store;
