import React, { useEffect, useState } from 'react'
import FilterModal from './FilterModal';
import { useDispatch } from 'react-redux';
import { getAllProperties } from '../../Store/Property/property-action';
import { propertyAction } from '../../Store/Property/property-slice';


const Filter = () => {
  //isModalOpen==>Switch, setisModalOpen-->Hand
    const [isModalOpen, setisModalOpen] = useState(false);
    //state for storing selected filter
    const[selectedFilters,setSelectedFilters] = useState({});
    const dispatch =useDispatch();
    useEffect(()=>{
      dispatch(propertyAction.updateSearchParams(selectedFilters));
      dispatch(getAllProperties());
    },[selectedFilters,dispatch]);

    //Function to handle opening the modal/popupwindow
    const handleOpenModal=()=>{
      setisModalOpen(true); //sets setisModalOpen to true to open the modal
    };

    //Function to handle closing the modal/popupwindow
    const handleCloseModal=()=>{
      setisModalOpen(false); //sets setisModalOpen to false to close the modal
    };

    //Function to handle changes in filters
    const handleFilterChange=(filterName,value)=>{
      //Update the selected filters with the new values
      setSelectedFilters((prevFilters)=>({
        ...prevFilters,
        [filterName]:value,
      }));
    };

  return (
    <>
      {/* Click event to open the modal */}
      <span class="material-symbols-outlined " onClick={handleOpenModal}>tune</span>   
      {isModalOpen &&(<FilterModal 
      selectedFilters={selectedFilters}
      onFilterChange={handleFilterChange}
      onClose={handleCloseModal}
    />
    )}
    </>
  )
}

export default Filter;