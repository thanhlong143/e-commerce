import clsx from "clsx"
import React, { memo } from "react"

const Select = ({ label, option = [], register, errors, id, validate, style, fullWidth, defaultValue }) => {
   return (
      <div className="flex flex-col gap-2">
         {label && <label htmlFor={id}>{label}</label>}
         <select defaultValue={defaultValue} className={clsx("form-select", fullWidth && "w-full", style)} id={id} {...register(id, validate)}>
            {/* <option value="">---CHOOSE---</option> */}
            {option?.map(el => (
               <option key={el.value} value={el.code}>{el.value}</option>
            ))}
         </select>
         {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
      </div>
   )
}

export default memo(Select)