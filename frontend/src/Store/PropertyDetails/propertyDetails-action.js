import axios from "axios";
import { propertyDetailsAction } from "./propertyDetails-slice";


export const getPropertyDetails = (id) => async (dispatch) => {
  try {
   
    dispatch(propertyDetailsAction.getListRequest());

 
    const response = await axios.get(`/api/v1/rent/listing/${id}`);

    
    const responseData = response.data;

    if (!responseData) {
      throw new Error("Property listing information not found on the server.");
    }

  
    const finalPayload = 
      responseData.property || 
      (responseData.data && responseData.data.property) || 
      responseData.data || 
      responseData;

    dispatch(propertyDetailsAction.getPropertyDetails(finalPayload));
  } catch (error) {
    console.error("Fetch property details action failure:", error);

   
    const fallbackMessage = 
      error.response && error.response.data && (error.response.data.message || error.response.data.error)
        ? (error.response.data.message || error.response.data.error)
        : error.message || "An unexpected error occurred while loading property details.";

    dispatch(propertyDetailsAction.getErrors(fallbackMessage));
  }
};
