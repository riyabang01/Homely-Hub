import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getAllProperties } from "../../Store/Property/property-action";
import { propertyAction } from "../../Store/Property/property-slice";
import dayjs from "dayjs";

const Search = () => {
  const { RangePicker } = DatePicker;
  const dispatch = useDispatch();
  const searchParams = useSelector((state) => state.properties.searchParams);

  
  const [keyword, setKeyword] = useState(searchParams.city || "");
  const [guests, setGuests] = useState(searchParams.guests || "");
  const [value, setValue] = useState(() => {
    if (searchParams.dateIn && searchParams.dateOut) {
      return [dayjs(searchParams.dateIn), dayjs(searchParams.dateOut)];
    }
    return null; 
  });

  
  useEffect(() => {
    setKeyword(searchParams.city || "");
    setGuests(searchParams.guests || "");
    setValue(
      searchParams.dateIn && searchParams.dateOut
        ? [dayjs(searchParams.dateIn), dayjs(searchParams.dateOut)]
        : null
    );
  }, [searchParams]);

  const searchHandler = (e) => {
    e.preventDefault();
    
    const updateParams = {
      ...searchParams,
      city: keyword,
      guests: guests,
      dateIn: value && value[0] ? value[0].format("YYYY-MM-DD") : undefined,
      dateOut: value && value[1] ? value[1].format("YYYY-MM-DD") : undefined,
      page: 1,
    };

    dispatch(propertyAction.updateSearchParams(updateParams));
    dispatch(getAllProperties());
  };

  return (
    <form onSubmit={searchHandler} className="searchbar mb-0">
      
      <input
        type="text"
        className="search"
        placeholder="Search Destinations..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      
      <div className="search">
        <RangePicker
          className="date_picker"
          value={value}
          
          disabledDate={(current) => current && current < dayjs().startOf("day")}
          onChange={(val) => setValue(val)}
          placeholder={["Check In", "Check Out"]}
          suffixIcon={null}
          allowClear={true} 
          style={{
            background: "transparent",
            boxShadow: "none",
            width: "100%",
            height: "100%",
            padding: "0 12px",
          }}
        />
      </div>

      <input
        type="number"
        className="search"
        placeholder="Guests"
        min="1"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
      />

      <button
        type="submit"
        className="border-0 bg-transparent p-0 me-1 d-flex align-items-center justify-content-center"
        aria-label="Submit Search"
      >
        <span className="material-symbols-outlined searchicon m-0">search</span>
      </button>
    </form>
  );
};

export default Search;
