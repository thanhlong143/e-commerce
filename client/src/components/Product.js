import React, { useState } from "react";
import { formatMoney, renderStarFromNumber } from "../utils/helpers";
import newLabel from "../assets/new-label.png";
import trendingLabel from "../assets/trending-label.png";
import defaultThumb from "../assets/default-product-image.png";
import { SelectOption } from "./";
import icons from "../utils/icons";

const { AiFillEye, AiOutlineMenu, BsFillSuitHeartFill } = icons;

const Product = ({ productData, isNew }) => {
   const [isShowOption, setIsShowOption] = useState(false);
   return (
      <div className="w-full text-base px-[10px]">
         <div
            className="w-full border p-[15px] flex flex-col items-center"
            onMouseEnter={e => {
               e.stopPropagation()
               setIsShowOption(true)
            }}
            onMouseLeave={e => {
               e.stopPropagation()
               setIsShowOption(false)
            }}
         >
            <div className="w-full relative">
               {isShowOption && <div className="absolute bottom-[-10px] left-0 right-0 flex justify-center gap-2 animate-slide-top">
                  <SelectOption icon={<AiFillEye />} />
                  <SelectOption icon={<AiOutlineMenu />} />
                  <SelectOption icon={<BsFillSuitHeartFill />} />
               </div>}

               <img
                  src={productData?.thumb || defaultThumb}
                  alt=""
                  className="w-[274px] h-[274px] object-cover"
               />
               <img src={isNew ? newLabel : trendingLabel} alt=""
                  className={
                     `absolute ${isNew
                        ? "w-[120px] top-[-15px] right-[-15px]"
                        : "w-[120px] top-[-15px] right-[-15px]"} object-contain
                     `
                  }
               />
            </div>
            <div className="flex flex-col gap-1 mt-[15px] items-start w-full">
               <span className="flex h-4">{renderStarFromNumber(productData?.averageRating)?.map((el, index) => (
                  <span key={index}>{el}</span>
               ))}</span>
               <span className="line-clamp-2">{productData?.title}</span>
               <span>{`${formatMoney(productData?.price)} VND`}</span>
            </div>
         </div>
      </div>
   )
}

export default Product;