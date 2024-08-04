import clsx from "clsx"
import React, { memo } from "react"

const Select = ({ label, option = [], register, errors, id, validate, style, fullWidth, defaultValue }) => {
   return (
      <div className={clsx("flex flex-col gap-2", style)}>
         {label && <label htmlFor={id}>{label}</label>}
         <select defaultValue={defaultValue} className={clsx("form-select max-h-[42px]", fullWidth && "w-full")} id={id} {...register(id, validate)}>
            <option value="">---Chọn---</option>
            {option?.map(el => (
               <option key={el.value} value={el.code}>{el.value}</option>
            ))}
         </select>
         {errors[id] && <small className='text-xs text-red-500'>{errors[id]?.message}</small>}
      </div>
   )
}

export default memo(Select)