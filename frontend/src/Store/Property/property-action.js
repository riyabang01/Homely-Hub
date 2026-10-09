import axios from "axios";
import { propertyAction } from "./property-slice";

export const getAllProperties = () => async (dispatch, getState) => {
  try {
    dispatch(propertyAction.getRequest());

    const { searchParams } = getState().properties || {};

    const cleanedParams = {};
    if (searchParams) {
      Object.keys(searchParams).forEach((key) => {
        if (searchParams[key] !== undefined && searchParams[key] !== null && searchParams[key] !== "") {
          cleanedParams[key] = searchParams[key];
        }
      });
    }

    const response = await axios.get(`/api/v1/rent/listing`, {
      params: cleanedParams,
      withCredentials: true
    });

    const responseData = response.data;

    if (responseData && responseData.success === false) {
      throw new Error(responseData.message || "Failed to retrieve listing records from data models.");
    }

    const finalPayload = {
      properties: responseData.data || [], 
      totalProperties: responseData.all_properties || 0
    };

    dispatch(propertyAction.getProperties(finalPayload));
  } catch (error) {
    console.error("Fetch properties action process failure:", error);

    const fallbackMessage = 
      error.response && error.response.data && error.response.data.message
        ? error.response.data.message
        : error.message || "An unexpected error occurred while loading property grids.";

    dispatch(propertyAction.getErrors(fallbackMessage));
  }
};
