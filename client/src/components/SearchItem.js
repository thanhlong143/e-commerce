import React, { memo, useEffect, useState } from "react";
import icons from "../utils/icons";
import { colors } from "../utils/contants";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";

const { AiOutlineDown } = icons;
const SearchItem = ({ name, activeClick, changeActiveFilter, type = "checkbox" }) => {
   const navigate = useNavigate();
   const [selected, setSelected] = useState([]);
   const { category } = useParams();

   const handleSelect = (e) => {
      const alreadyEl = selected.find(el => el === e.target.value);
      if (alreadyEl) {
         setSelected(prev => prev.filter(el => el !== e.target.value));
      }
      else {
         setSelected(prev => [...prev, e.target.value]);
      }
      changeActiveFilter(null);
   }
   useEffect(() => {
      navigate({
         pathname: `/${category}`,
         search: createSearchParams({
            color: selected
         }).toString()
      })
   },[selected, navigate, category])
   return (
      <div
         className="p-3 cursor-pointer text-gray-500 relative border border-gray-800 flex items-center justify-between text-xs gap-6"
         onClick={() => changeActiveFilter(name)}
      >
         <span className="capitalize">{name}</span>
         <AiOutlineDown />
         {activeClick === name && <div className="absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]">
            {type === "checkbox" && <div className="">
               <div className="p-4 items-center flex justify-between gap-8 border-b">
                  <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
                  <span onClick={e => {
                     e.stopPropagation();
                     setSelected([]);
                  }} className="underline cursor-pointer hover:text-main">Reset</span>
               </div>
               <div onClick={e => e.stopPropagation()} className="flex flex-col gap-3 mt-4">
                  {colors.map((el, index) => (
                     <div key={index} className="flex items-center gap-4" >
                        <input
                           type="checkbox"
                           value={el}
                           id={el}
                           checked={selected.some(selectedItem => selectedItem === el)}
                           onChange={handleSelect}
                           className="form-checkbox"
                        />
                        <label className="capitalize text-gray-700" htmlFor={el}>{el}</label>
                     </div>
                  ))}
               </div>
            </div>}
         </div>}
      </div>
   )
}

export default memo(SearchItem)