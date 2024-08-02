import clsx from "clsx";
import React from "react";

const InputField = ({ value, setValue, nameKey, type, invalidFields, setInvalidFields, style, fullWidth, placeholder, isHideLabel }) => {
   return (
      <div className={clsx("flex flex-col relative mb-2", fullWidth && "w-full")}>
         {!isHideLabel && value.trim() !== "" && <label className="text-[10px] animate-slide-top-sm absolute top-0 left-[12px] block bg-white px-1" htmlFor={nameKey}>{nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}</label>}
         <input
            type={type || "text"}
            className={clsx("px-4 py-2 rounded-sm border w-full mt-2 placeholder:text-sm placeholder:italic outline-none", style)}
            placeholder={placeholder || nameKey?.slice(0, 1).toUpperCase() + nameKey?.slice(1)}
            value={value}
            onChange={e => setValue(prev => ({ ...prev, [nameKey]: e.target.value }))}
            onFocus={() => setInvalidFields && setInvalidFields([])}
         />
         {invalidFields && invalidFields.some(el => el.name === nameKey) && <small className="text-main italic" >
            {invalidFields && invalidFields.find(el => el.name === nameKey)?.message}
         </small>}
      </div>
   )
}

export default InputField