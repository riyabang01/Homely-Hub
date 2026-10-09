import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../../Store/Property/property-action";
import { propertyAction } from "../../Store/Property/property-slice";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const Card = ({ id, image, address, price, name }) => {
  return (
    <figure className="property">
      <Link to={`/propertylist/${id}`}>
        <img src={image} alt={`${name} property`} />
      </Link>
      <figcaption className="propertydetails">
        <h5>{name}</h5>
        <h6>
          <span className="material-symbols-outlined houseicon">home_pin</span> {address}
        </h6>
        <p>
          <span className="price">₹{price}</span> per night
        </p>
      </figcaption>
    </figure>
  );
};

Card.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

const PropertyList = () => {
 
  const [currentPage, setCurrentPage] = useState(1);
  
  const { properties, totalProperties } = useSelector(
    (state) => state.properties
  );
  
  const propertiesPerPage = 12;
  const lastPage = Math.ceil(totalProperties / propertiesPerPage) || 1;
  const dispatch = useDispatch();

  useEffect(() => {
   
    dispatch(propertyAction.updateSearchParams({ page: currentPage }));
    dispatch(getAllProperties());
  }, [currentPage, dispatch]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, lastPage));
  };

  return (
    <>
      {properties.length === 0 ? (
        <p className="not_found">"Property not found......"</p>
      ) : (
        <div className="propertylist">
          {properties.map((property) => (
            <Card
              key={property._id}
              id={property._id}
              image={property.images?.[0]?.url || "/assets/placeholder.png"}
              name={property.propertyName}
              address={`${property.address.city}, ${property.address.state}, ${property.address.pincode}`}
              price={property.price}
            />
          ))}
        </div>
      )}


      <div 
        className="pagination"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px",
          width: "100%",
          margin: "40px auto",
          position: "relative",
          float: "none",
          clear: "both"
        }}
      >
        
        <button
          type="button"
          className="previous_btn"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          aria-label="Previous page"
          style={{ position: "static", margin: "0", float: "none" }}
        >
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>

        
        <button
          type="button"
          className="next_btn"
          onClick={handleNextPage}
          disabled={properties.length < propertiesPerPage || currentPage === lastPage}
          aria-label="Next page"
          style={{ position: "static", margin: "0", float: "none" }}
        >
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
      </div>
    </>
  );
};

export default PropertyList;
