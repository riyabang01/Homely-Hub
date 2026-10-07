import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  errors: null,
  success: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  
    getSignupRequest(state) {
      state.loading = true;
      state.errors = null;
    },
   
    getSignupDetails(state, action) {

      state.user = action.payload?.user || action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
  
    getLoginRequest(state) {
      state.loading = true;
      state.errors = null;
    },

    getLoginDetails(state, action) {

      state.user = action.payload?.user || action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    
    getCurrentUserRequest(state) {
      state.loading = true;
    },

    getUpdateUserRequest(state) {
      state.loading = true;
    },
  
    getCurrentUser(state, action) {

      const resolvedUser = action.payload?.user || action.payload;
      state.user = resolvedUser || null;
      state.isAuthenticated = !!resolvedUser; 
      state.loading = false;
    },

    getLogoutRequest(state) {
      state.loading = true;
    },
   
    getLogout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.success = false; 
    },
    
    getPasswordRequest(state) {
      state.loading = true;
      state.errors = null;
    },

    getPasswordSuccess(state, action) {
      state.success = action.payload;
      state.loading = false;
    },

    getError(state, action) {
      state.errors = action.payload;
      state.loading = false; 
    },
    
    clearError(state) {
      state.errors = null;
    },
  },
});


export const userActions = userSlice.actions;


export default userSlice.reducer;
