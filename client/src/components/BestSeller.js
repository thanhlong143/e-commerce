import React, { useState, useEffect } from "react";
import { apiGetProducts } from "../apis/product";
import { CustomSlider } from "./";
import * as actions from "../store/products/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import smallBanner1 from "../assets/small-banner-1.png";
import smallBanner2 from "../assets/small-banner-2.png";

const tabs = [
   { id: 1, name: "best seller" },
   { id: 2, name: "new arrivals" },
]

const BestSeller = () => {
   const [bestSellers, setBestSellers] = useState(null);
   const [activedTab, setActivedTab] = useState(1);
   const [products, setProducts] = useState(null);
   const dispatch = useDispatch();
   const { newProducts } = useSelector(state => state.products);

   useEffect(() => {
      const fetchProducts = async () => {
         const response = await apiGetProducts({ sort: "-sold" });
         if (response.success) {
            setBestSellers(response.products);
            setProducts(response.products);
         }
      }
      fetchProducts();
      dispatch(actions.getNewProducts())
   }, [dispatch]);

   useEffect(() => {
      if (activedTab === 1) {
         setProducts(bestSellers)
      }
      if (activedTab === 2) {
         setProducts(newProducts)
      }
   }, [activedTab, bestSellers, newProducts]);

   return (
      <div>
         <div className="flex text-[20px] ml-[-32px]">
            {tabs.map(el => (
               <span key={el.id} className={`font-semibold uppercase px-8 border-r cursor-pointer text-gray-400 ${activedTab === el.id ? "text-gray-900" : ""}`}
                  onClick={() => setActivedTab(el.id)}
               >{el.name}</span>
            ))}
         </div>
         <div className="mt-4 mx-[-10px] border-t-2 border-main pt-4">
            <CustomSlider products={products} activedTab={activedTab} />
         </div>
         <div className="w-full flex gap-4 mt-4">
            <img src={smallBanner1} alt="small-banner-1" className="flex-1 object-contain" />
            <img src={smallBanner2} alt="small-banner-2" className="flex-1 object-contain" />
         </div>
      </div>
   )
}

export default BestSeller;