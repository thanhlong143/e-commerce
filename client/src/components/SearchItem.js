import React, { memo, useEffect, useState } from "react";
import icons from "../utils/icons";
import { colors } from "../utils/contants";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { apiGetProducts } from "../apis";
import useDebounce from "../hooks/useDebounce";

const { AiOutlineDown } = icons;
const SearchItem = ({ name, activeClick, changeActiveFilter, type = "checkbox" }) => {
   const navigate = useNavigate();
   const { category } = useParams();
   const [selected, setSelected] = useState([]);
   const [price, setPrice] = useState({
      from: "",
      to: ""
   });
   const [bestPrice, setBestPrice] = useState(null);

   const handleSelect = (e) => {
      const alreadyEl = selected.find(el => el === e.target.value);
      if (alreadyEl) {
         setSelected(prev => prev.filter(el => el !== e.target.value));
      }
      else {
         setSelected(prev => [...prev, e.target.value]);
      }
      changeActiveFilter(null);
   }
   useEffect(() => {
      if (selected.length > 0) {
         navigate({
            pathname: `/${category}`,
            search: createSearchParams({
               color: selected.join(",")
            }).toString()
         })
      } else {
         navigate(`/${category}`)
      }
   }, [selected, navigate, category]);

   useEffect(() => {
      const fetchBestPriceProduct = async () => {
         const response = await apiGetProducts({ sort: "-price", limit: 1 });
         if (response.success) {
            setBestPrice(response.products[0]?.price);
         }
      }
      if (type === "input") {
         fetchBestPriceProduct();
      }
   }, [type]);

   // useEffect(() => {
   //    if (price.from > price.to) {
   //       alert("")
   //    }
   // },[price])

   const debouncePriceFrom = useDebounce(price.from, 500);
   const debouncePriceto = useDebounce(price.to, 500);
   useEffect(() => {
      const data = {};
      if (Number(debouncePriceFrom) > 0) {
         data.from = debouncePriceFrom;
      }
      if (Number(debouncePriceto) > 0) {
         data.to = debouncePriceto;
      }
      navigate({
         pathname: `/${category}`,
         search: createSearchParams(data).toString()
      })
   }, [debouncePriceFrom, debouncePriceto, category, navigate]);

   return (
      <div
         className="p-3 cursor-pointer text-gray-500 relative border border-gray-800 flex items-center justify-between text-xs gap-6"
         onClick={() => changeActiveFilter(name)}
      >
         <span className="capitalize">{name}</span>
         <AiOutlineDown />
         {activeClick === name && <div className="absolute z-10 top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]">
            {type === "checkbox" && <div className="">
               <div className="p-4 items-center flex justify-between gap-8 border-b">
                  <span className="whitespace-nowrap">{`${selected.length} selected`}</span>
                  <span onClick={e => {
                     e.stopPropagation();
                     setSelected([]);
                  }} className="underline cursor-pointer hover:text-main">Reset</span>
               </div>
               <div onClick={e => e.stopPropagation()} className="flex flex-col gap-3 mt-4">
                  {colors.map((el, index) => (
                     <div key={index} className="flex items-center gap-4" >
                        <input
                           type="checkbox"
                           value={el}
                           id={el}
                           checked={selected.some(selectedItem => selectedItem === el)}
                           onChange={handleSelect}
                           className="form-checkbox"
                        />
                        <label className="capitalize text-gray-700" htmlFor={el}>{el}</label>
                     </div>
                  ))}
               </div>
            </div>}
            {type === "input" && <div onClick={e => e.stopPropagation()}>
               <div className="p-4 items-center flex justify-between gap-8 border-b">
                  <span className="whitespace-nowrap">{`Giá cao nhất là ${Number(bestPrice).toLocaleString()} VND`}</span>
                  <span onClick={e => {
                     e.stopPropagation();
                     setPrice({ from: "", to: "" });
                     changeActiveFilter(null);
                  }} className="underline cursor-pointer hover:text-main">Reset</span>
               </div>
               <div className="flex items-center p-2 gap-2">
                  <div className="flex items-center gap-2">
                     <label htmlFor="from">From</label>
                     <input
                        value={price.from}
                        onChange={e => setPrice(prev => ({...prev, from: e.target.value}))}
                        className="form-input"
                        type="number"
                        id="from" />
                  </div>
                  <div className="flex items-center gap-2">
                     <label htmlFor="to">To</label>
                     <input
                        value={price.to}
                        onChange={e => setPrice(prev => ({...prev, to: e.target.value}))}
                        className="form-input"
                        type="number"
                        id="to" />
                  </div>
               </div>
            </div>}
         </div>}
      </div>
   )
}

export default memo(SearchItem)