import React, { useState, useEffect } from "react";
import { ProductCard } from "..";
import { apiGetProducts } from "apis";
import bannerLargeBottom from "assets/banner-large-bottom.png";
import bannerMediumBottom from "assets/banner-medium-bottom.png";
import bannerSmallBottom1 from "assets/banner-small-bottom-1.png";
import bannerSmallBottom2 from "assets/banner-small-bottom-2.png";

const FeatureProducts = () => {
   const [products, setProducts] = useState(null);

   const fetchProducts = async () => {
      const response = await apiGetProducts({ limit: 9, sort: "-averageRating" });
      if (response.success) {
         setProducts(response.products)
      }
   }

   useEffect(() => {
      fetchProducts();
   }, []);

   return (
      <div className="w-full">
         <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">FEATURE PRODUCTS</h3>
         <div className="flex flex-wrap mt-[15px] mx-[-10px]">
            {products?.map(el => (
               <ProductCard
                  key={el._id}
                  image={el.thumb}
                  title={el.title}
                  averageRating={el.averageRating}
                  price={el.price}
               />
            ))}
         </div>
         <div className="grid grid-cols-4 grid-rows-2 gap-4">
            <img src={bannerLargeBottom} alt="" className="w-full h-full object-cover col-span-2 row-span-2" />
            <img src={bannerSmallBottom1} alt="" className="w-full h-full object-cover col-span-1 row-span-1" />
            <img src={bannerMediumBottom} alt="" className="w-full h-full object-cover col-span-1 row-span-2" />
            <img src={bannerSmallBottom2} alt="" className="w-full h-full object-cover col-span-1 row-span-1" />
         </div>
      </div>
   )
}

export default FeatureProducts