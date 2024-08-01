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
      const response = await apiGetProducts({ limit: 9, averageRating: 5 });
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
         <div className="flex justify-between">
            <img src={bannerLargeBottom} alt="" className="w-[49%] object-contain" />
            <div className="flex flex-col justify-between gap-4 w-[24%]">
               <img src={bannerSmallBottom1} alt="" />
               <img src={bannerSmallBottom2} alt="" />
            </div>
            <img src={bannerMediumBottom} alt="" className="w-[24%] object-contain" />
         </div>
      </div>
   )
}

export default FeatureProducts