import axios from "axios";
import { propertyAction } from "./property-slice";

export const getAllProperties = () => async (dispatch, getState) => {
  try {
    dispatch(propertyAction.getRequest());

    const { searchParams } = getState().properties || {};

    const response = await axios.get(`/api/v1/rent/listing`, {
      params: searchParams,
      withCredentials: true
    });

    const { data } = response;

    if (data && data.success === false) {
      throw new Error(data.message || "Failed to retrieve listing records from data models.");
    }

    dispatch(propertyAction.getProperties(data));
  } catch (error) {
    console.error("Fetch properties action process failure:", error);

    const fallbackMessage = 
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message || "An unexpected error occurred while loading property grids.";

    dispatch(propertyAction.getErrors(fallbackMessage));
  }
};
