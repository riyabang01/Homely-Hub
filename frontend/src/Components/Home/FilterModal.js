import React, { useEffect, useState } from "react";
import PropTypes from "prop-types"; // for type-checking props
import "../../CSS/FilterModal.css";
import "react-input-range/lib/css/index.css"; // Importing css file for input range styling
import InputRange from "react-input-range";

const FilterModal = ({ selectedFilters, onFilterChange, onClose }) => {
  const [priceRange, setPriceRange] = useState({
    min: selectedFilters.priceRange?.min || 600,
    max: selectedFilters.priceRange?.max || 30000,
  });

  const [propertyType, setPropertyType] = useState(
    selectedFilters.propertyType || "" // default it is empty or the selected property type from props
  );

  const [roomType, setRoomType] = useState(selectedFilters.roomType || "");

  const [amenities, setAmenities] = useState(selectedFilters.amenities || []);

  //useEffect hook to update states when selectedFilters prop changes
  useEffect(() => {
    setPriceRange({
      min: selectedFilters.priceRange?.min || 600,
      max: selectedFilters.priceRange?.max || 30000,
    });

    setPropertyType(selectedFilters.propertyType || "");
    setRoomType(selectedFilters.roomType || "");
    setAmenities(selectedFilters.amenities || []);
  }, [selectedFilters]);

  //Functions to handle changes in price range
  const handlePriceRangeChange = (value) => {
    setPriceRange(value); //it will update the price range state
  };

  //Functions to handle min value
  const handleMinInputChange = (e) => {
    const minValue = parseInt(e.target.value, 10);
    setPriceRange((prev) => ({ ...prev, minValue }));
  };

  //Function to handle max value
  const handleMaxInputChange = (e) => {
    const maxValue = parseInt(e.target.value, 10);
    setPriceRange((prev) => ({ ...prev, maxValue }));
  };
  //function to handle applying filters
  const handleFilterChange = () => {
    onFilterChange("minPrice", priceRange.min);
    onFilterChange("maxPrice", priceRange.max);
    onFilterChange("propertyType", propertyType);
    onFilterChange("roomType", roomType);
    onFilterChange("amenities", amenities);
    onClose(); //closes the window/modal
  };
  //Options for property types

  const propertyTypeOptions = [
    {
      value: "House",
      label: "House",
      icon: "home",
    },
    {
      value: "Flat",
      label: "Flat",
      icon: "apartment",
    },
    {
      value: "GUest House",
      label: "GUEST House",
      icon: "hotel",
    },
    {
      value: "Hotel",
      label: "Hotel",
      icon: "meeting_room",
    },
  ];

  //Options for room types
  const roomTypeOptions = [
    {
      value: "Entire Room",
      label: "Entire Room",
      icon: "hotel",
    },
    {
      value: "Room",
      label: "Room",
      icon: "meeting_room",
    },
    {
      value: "AnyType",
      label: "Any Type",
      icon: "apartment",
    },
  ];

  //Options for amenities
  const amenitiesOptions = [
    {
      value: "Wifi",
      label: "Wifi",
      icon: "wifi",
    },
    {
      value: "Kitchen",
      label: "Kitchen",
      icon: "kitchen",
    },
    {
      value: "Ac",
      label: "Ac",
      icon: "ac_unit",
    },
    {
      value: "Washing Machine",
      label: "Washing Machine",
      icon: "local_laundry_service",
    },
    {
      value: "Tv",
      label: "Tv",
      icon: "tv",
    },
    {
      value: "Pool",
      label: "Pool",
      icon: "pool",
    },
    {
      value: "Free Parking",
      label: "Free Parking",
      icon: "local_parking",
    },
  ];

  //Function to handle clearing filters
  const handleClearFilters = () => {
    setPriceRange({ min: 600, max: 30000 }); //rest the price range
    setPropertyType("");
    setRoomType("");
    setAmenities([]);
  };

  // functions to handle changes in the amenities
  const handleAmenitiesChange = (selectedAmenity) => {
    setAmenities(
      (prevAmenities) =>
        prevAmenities.includes(selectedAmenity)
          ? prevAmenities.filter((item) => item !== selectedAmenity)
          : [...prevAmenities, selectedAmenity] // corrected typo here
    );
  };

  //Function to handle changes in the properttType
  const handlePropertyTypeChange = (selectedType) => {
    setPropertyType((prevType) =>
      prevType === selectedType ? "" : selectedType
    );
  };
  //Function to handle room type
  const handleRoomTypeChange = (selectedType) => {
    setRoomType((prevType) => (prevType === selectedType ? "" : selectedType));
  };
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h4>
          Filters <hr />
        </h4>
        {/* Close button */}
        <button className="close-button" onClick={onClose}>
          <span>&times;</span>
        </button>

        {/* Filter Sections */}
        <div className="modal-filters-container">
          {/* Price range filter */}
          <div className="filter-section">
            <label>Price range:</label>
            <InputRange
              minValue={600}
              maxValue={30000}
              value={priceRange}
              onChange={handlePriceRangeChange}
            />
            <div className="range-inputs">
              <input
                type="number"
                value={priceRange.min}
                onChange={handleMinInputChange}
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={handleMaxInputChange}
              />
            </div>
          </div>

          {/* Properties type filter */}
          <div className="filter-section">
            <label>Property Type: </label>
            <div className="icon-box">
              {propertyTypeOptions.map((options) => (
                <div
                  key={options.value}
                  className={`selectable-box ${
                    propertyType === options.value ? "selected" : ""
                  }`}
                  onClick={() => handlePropertyTypeChange(options.value)}
                >
                  <span className="material-icons">{options.icon}</span>
                  <span> {options.label} </span>
                </div>
              ))}
            </div>
          </div>
          {/* Room type filter */}
          <div className="filter-section">
            <label>Room Type:</label>
            <div className="icon-box">
              {roomTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`selectable-box ${
                    roomType === option.value ? "selected" : ""
                  }`}
                  onClick={() => handleRoomTypeChange(option.value)}
                >
                  <span className="material-icons">{option.icon}</span>
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities filter */}

          <div className="filter-section">
            <label>Amenities:</label>
            <div className="amenities-checkboxes">
              {amenitiesOptions.map((option) => (
                <div key={option.value} className="amenity-checkbox">
                  {console.log(amenities.includes(option.value))}
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={amenities.includes(option.value)}
                    onChange={() => handleAmenitiesChange(option.value)}
                  />
                  <span className="material-icons ameniteslabel">
                    {option.icon}
                  </span>
                  <span>{option.label}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Filter action buttons  */}
          <div className="filter-buttons">
            <button className="clear-button" onClick={handleClearFilters}>
              Clear
            </button>
            <button onClick={handleFilterChange}>Apply Filters</button>
          </div>
        </div>
      </div>
    </div>
  );
};
// PropTypes
FilterModal.propTypes = {
  selectedFilters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FilterModal;
