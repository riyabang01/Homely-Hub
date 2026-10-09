import React, { useEffect } from "react";
import "../../CSS/PropertyDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPropertyDetails } from "../../Store/PropertyDetails/propertyDetails-action";
import PropertyImg from "./PropertyImg";
import PropertyAmenities from "./PropertyAmenities";
import BookingForm from "./BookingForm";
import MapComponent from "./MapComponent";

const PropertyDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { propertydetails, loading } = useSelector((state) => state.propertydetails || {});

  useEffect(() => {
    dispatch(getPropertyDetails(id));
  }, [dispatch, id]);

  if (loading || !propertydetails || Object.keys(propertydetails).length === 0) {
    return <div className="loading-container" style={{ textAlign: "center", marginTop: "50px" }}>Loading Property Details...</div>;
  }

  const { propertyName, address, images, description, maximumGuest, amenities, price, currentBookings, extraInfo } = propertydetails;

  return (
    <div className="property-container">
      {propertyName && (
        <>
          <p className="property-header">{propertyName}</p>
          <h6 className="property-location">
            <span className="material-symbols-outlined">house</span>
            <span className="location">
              {address ? `${address.area || ""}, ${address.city || ""}, ${address.pincode || ""}, ${address.state || ""}` : ""}
            </span>
          </h6>
          
          <PropertyImg images={images} />

          <div className="middle-container row">
            <div className="des-and-amenities col-12">
              <h2 className="property-description-header">Description</h2>
              <p className="property-description">
                {description}<br /> <br />
                Max number of Guests: {maximumGuest}
              </p>
              <hr />
              <PropertyAmenities amenities={amenities} />
            </div>
          </div>

          <hr />

          <div className="map-image-exinfo-container">
            <div className="map-image-container">
              <h2 className="map-header">Where you will be</h2>
              {address && <MapComponent address={address} />}
            </div>

            <div className="property-payment">
              <h2 className="map-header">Book Your Stay</h2>
              <BookingForm
                propertyId={id}
                price={price}
                propertyName={propertyName}
                address={address}
                maximumGuest={maximumGuest}
                currentBookings={currentBookings}
              />
            </div>

            <div className="extra-info">
              <h2 className="extra-heading">Extra Info</h2>
              <p className="extra-description">{extraInfo}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyDetails;
