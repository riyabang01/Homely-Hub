import axios from "axios";
import { userActions } from "./user-slice";


const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || "An unexpected network error occurred.";
};


export const getSignUp = (user) => async (dispatch) => {
  try {
    dispatch(userActions.getSignupRequest());
    const { data } = await axios.post("/api/v1/rent/user/signup", user);
    dispatch(userActions.getSignupDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(getErrorMessage(error)));
  }
};


export const getLogIn = (user) => async (dispatch) => {
  try {
    dispatch(userActions.getLoginRequest());
    const { data } = await axios.post("/api/v1/rent/user/login", user);
    dispatch(userActions.getLoginDetails(data.user));
  } catch (error) {
    dispatch(userActions.getError(getErrorMessage(error)));
  }
};


export const currentUser = () => async (dispatch) => {
  try {
    dispatch(userActions.getCurrentUserRequest());
    const { data } = await axios.get("/api/v1/rent/user/me");
    dispatch(userActions.getCurrentUser(data.user));
  } catch (error) {
    dispatch(userActions.getError(getErrorMessage(error)));
  }
};


export const updateUser = (updatedUserData) => async (dispatch) => {
  try {
    dispatch(userActions.getUpdateUserRequest());
    await axios.patch("/api/v1/rent/user/updateMe", updatedUserData);
    
    
    const { data } = await axios.get("/api/v1/rent/user/me");
    dispatch(userActions.getCurrentUser(data.user));
  } catch (error) {
    dispatch(userActions.getError(getErrorMessage(error)));
  }
};


export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch(userActions.getLoginRequest());
    
    await axios.post("/api/v1/rent/user/forgotPassword", email);
    dispatch(userActions.getPasswordSuccess(true));
  } catch (error) {
    dispatch(userActions.getError(getErrorMessage(error)));
  }
};


export const resetPassword = (repassword, token) => async (dispatch) => {
  try {
    dispatch(userActions.getPasswordRequest());
    
    await axios.patch(`/api/v1/rent/user/resetPassword/${token}`, repassword);
    dispatch(userActions.getPasswordSuccess(true));
  } catch (error) {
    dispatch(userActions.getError(getErrorMessage(error)));
  }
};


export const updatePassword = (passwords) => async (dispatch) => {
  try {
    dispatch(userActions.getPasswordRequest());
    await axios.patch("/api/v1/rent/user/updateMyPassword", passwords);
    dispatch(userActions.getPasswordSuccess(true));
  } catch (error) {
    dispatch(userActions.getError(getErrorMessage(error)));
  }
};


export const Logout = () => async (dispatch) => {
  try {
    await axios.get("/api/v1/rent/user/logout");
    dispatch(userActions.getLogout(null));
  } catch (error) {
    dispatch(userActions.getError(getErrorMessage(error)));
  }
};
