import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct } from "../../apis";

const ProductDetails = () => {
   const { pid, title } = useParams();
   
   useEffect(() => {
      const fetchProductData = async () => {
         const response = await apiGetProduct(pid);
         console.log(response);
      }
      if (pid) {
         fetchProductData();
      }
   },[pid])
   return (
      <div className="w-full">
         <div className="h-[81px] flex items-center justify-center bg-gray-100">
            <div className="w-main">
               <h3>{title}</h3>
            </div>
         </div>
      </div>
   )
}

export default ProductDetails;