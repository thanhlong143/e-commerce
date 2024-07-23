import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts } from "../../apis";
import { Breadcrumb, Button, CustomSlider, ProductExtraInfoItem, ProductInformation, SelectQuantity } from "../../components";
import Slider from "react-slick";
import ReactImageMagnify from "react-image-magnify";
import { formatMoney, formatRoundPrice, renderStarFromNumber } from "../../utils/helpers";
import { productExtraInformation } from "../../utils/contants";

const settings = {
   dots: false,
   infinite: false,
   speed: 500,
   slidesToShow: 3,
   slidesToScroll: 1
};

const ProductDetails = () => {
   const { pid, title, category } = useParams();
   const [product, setProduct] = useState(null);
   const [quantity, setQuantity] = useState(1);
   const [relatedProducts, setRelatedProducts] = useState(null);
   const fetchProductData = async () => {
      const response = await apiGetProduct(pid);
      if (response.success) {
         setProduct(response.productData);
      }
   }
   const fetchProducts = async () => {
      const response = await apiGetProducts({ category });
      if (response.success) {
         setRelatedProducts(response.products);
      }
   }
   useEffect(() => {
      if (pid) {
         fetchProductData();
         fetchProducts();
      }
   }, [pid]);

   const handleQuantity = useCallback((number) => {
      if (!Number(number) || Number(number) < 1) {
         return
      } else {
         setQuantity(number);
      }
   }, [quantity]);
   const handleChangeQuantity = useCallback((flag) => {
      if (flag === "minus" && quantity > 1) {
         setQuantity(prev => +prev - 1);
      } else if (flag === "plus") {
         setQuantity(prev => +prev + 1);
      }
   }, [quantity]);
   return (
      <div className="w-full">
         <div className="h-[81px] flex items-center justify-center bg-gray-100">
            <div className="w-main">
               <h3 className="font-semibold">{title}</h3>
               <Breadcrumb title={title} category={category} />
            </div>
         </div>
         <div className="w-main m-auto mt-4 flex">
            <div className="w-2/5 flex flex-col gap-4">
               <div className="h-[458px] w-[458px] border">
                  <ReactImageMagnify {...{
                     smallImage: {
                        alt: "Product",
                        isFluidWidth: true,
                        src: product?.thumb
                     },
                     largeImage: {
                        src: product?.thumb,
                        width: 1200,
                        height: 1500
                     }
                  }} />
               </div>
               <div className="w-[458px]">
                  <Slider className="image-slider flex gap-2 justify-between" {...settings}>
                     {product?.images?.map(el => (
                        <div className="" key={el}>
                           <img src={el} alt="sub-product" className="h-[143px] w-[143px] border object-cover" />
                        </div>
                     ))}
                  </Slider>
               </div>
            </div>
            <div className="w-2/5 pr-[24px] flex-col gap-4">
               <div className="flex items-center justify-between">
                  <h2 className="text-[30px] font-semibold">{`${formatMoney(formatRoundPrice(product?.price))} VND`}</h2>
                  <span className="text-sm text-main">{`Kho ${product?.quantity}`}</span>
               </div>
               <div className="flex items-center gap-1">
                  {renderStarFromNumber(product?.averageRating)?.map((el, index) => (<span key={index}>{el}</span>))}
                  <span className="text-sm text-main italic">{`(Đã bán: ${product?.sold} cái)`}</span>
               </div>
               <ul className="list-square text-sm text-gray-500 pl-4">
                  {product?.description?.map(el => (<li className="leading-8" key={el}>{el}</li>))}
               </ul>
               <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-4">
                     <span className="font-semibold">Quantity</span>
                     <SelectQuantity
                        quantity={quantity}
                        handleQuantity={handleQuantity}
                        handleChangeQuantity={handleChangeQuantity}
                     />
                  </div>
                  <Button fw>
                     Add to Cart
                  </Button>
               </div>
            </div>
            <div className=" w-1/5">
               {productExtraInformation?.map(el => (
                  <ProductExtraInfoItem
                     key={el.id}
                     title={el.title}
                     icon={el.icon}
                     sub={el.sub}
                  />
               ))}
            </div>
         </div>
         <div className="w-main m-auto mt-8">
            <ProductInformation />
         </div>
         <div className="w-main m-auto mt-8">
            <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">OTHER CUSTOMER ALSO LIKED</h3>
            <CustomSlider normal={true} products={relatedProducts} />
         </div>
         <div className="h-[100px] w-full"></div>
      </div>
   )
}

export default ProductDetails;