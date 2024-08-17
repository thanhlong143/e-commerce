import withBaseComponent from "hocs/withBaseComponent";
import React from "react";
import { formatMoney, renderStarFromNumber } from "utils/helpers";

const ProductCard = ({ category, image, title, averageRating, price, pid, navigate }) => {
   return (
      <div
         onClick={() => navigate(`/${category?.toLowerCase()}/${pid}/${title}`)}
         className="w-1/3 flex-auto cursor-pointer px-[10px] mb-[20px]"
      >
         <div className="flex w-full border">
            <img src={image} alt="products" className="w-[120px] object-contain p-4" />
            <div className="flex flex-col mt-[15px] items-start gap-1 w-full text-xs">
               <span className="line-clamp-1 capitalize text-sm">{title?.toLowerCase()}</span>
               <span className="flex h-4">{renderStarFromNumber(averageRating, 14)?.map((el, index) => (
                  <span key={index}>{el}</span>
               ))}</span>
               <span>{`${formatMoney(price)} VND`}</span>
            </div>
         </div>
      </div>
   )
}

export default withBaseComponent(ProductCard);