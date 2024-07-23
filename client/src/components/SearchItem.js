import React, { memo } from "react";
import icons from "../utils/icons";
const { AiOutlineDown } = icons;

const SearchItem = ({ name, activeClick, changeActiveFilter }) => {
   return (
      <div
         onClick={() => changeActiveFilter(name)}
         className="p-3 text-gray-500 relative border border-gray-800 flex items-center justify-between text-xs gap-6"
      >
         <span className="capitalize">{name}</span>
         <AiOutlineDown />
         {activeClick === name && <div className="absolute top-full left-0 w-fit p-4 bg-red-500">
            Content
         </div>}
      </div>
   )
}

export default memo(SearchItem)