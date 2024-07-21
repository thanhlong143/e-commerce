import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct } from "../../apis";
import { Breadcrumb } from "../../components";

const ProductDetails = () => {
   const { pid, title, category } = useParams();
   useEffect(() => {
      const fetchProductData = async () => {
         const response = await apiGetProduct(pid);
         if (response.success) {
            // console.log(response.productData);
         }
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
               <Breadcrumb title={title} category={category} />
            </div>
         </div>
      </div>
   )
}

export default ProductDetails;