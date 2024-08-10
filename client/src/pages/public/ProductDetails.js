import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts } from "../../apis";
import { Breadcrumb, Button, CustomSlider, ProductExtraInfoItem, ProductInformation, SelectQuantity } from "../../components";
import Slider from "react-slick";
import ReactImageMagnify from "react-image-magnify";
import { formatMoney, formatRoundPrice, renderStarFromNumber } from "../../utils/helpers";
import { productExtraInformation } from "../../utils/contants";
import DOMPurify from "dompurify";
import clsx from "clsx";

const settings = {
   dots: false,
   infinite: false,
   speed: 500,
   slidesToShow: 3,
   slidesToScroll: 1
};

const ProductDetails = ({ isQuickView, data }) => {
   const params = useParams();
   const [product, setProduct] = useState(null);
   const [currentImage, setCurrentImage] = useState(null);
   const [quantity, setQuantity] = useState(1);
   const [relatedProducts, setRelatedProducts] = useState(null);
   const [update, setUpdate] = useState(false);
   const [variant, setVariant] = useState(null);
   const [pid, setPid] = useState(null);
   const [category, setCategory] = useState(null);
   const [currentProduct, setCurrentProduct] = useState({
      title: "",
      thumb: "",
      images: [],
      price: "",
      color: "",
   })

   useEffect(() => {
      if (data) {
         setPid(data.pid);
         setCategory(data.category)
      }
      else if (params) {
         setPid(params.pid);
         setCategory(params.category);
      }
   }, [data, params])

   const fetchProductData = async () => {
      const response = await apiGetProduct(pid);
      if (response.success) {
         setProduct(response.productData);
         setCurrentImage(response.productData?.thumb);
      }
   }

   useEffect(() => {
      if (variant) {
         setCurrentProduct({
            title: product?.variants?.find(el => el.sku === variant)?.title,
            thumb: product?.variants?.find(el => el.sku === variant)?.thumb,
            images: product?.variants?.find(el => el.sku === variant)?.images,
            price: product?.variants?.find(el => el.sku === variant)?.price,
            color: product?.variants?.find(el => el.sku === variant)?.color,
         })
      }
   }, [variant])

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
      window.scrollTo(0, 0);
   }, [pid]);

   useEffect(() => {
      if (pid) {
         fetchProductData();
      }
   }, [update]);

   const rerender = useCallback(() => {
      setUpdate(!update);
   }, [update])

   const handleQuantity = useCallback((number) => {
      if (!Number(number) || Number(number) < 1) {
         return
      } else {
         setQuantity(number);
      }
   }, []);
   const handleChangeQuantity = useCallback((flag) => {
      if (flag === "minus" && quantity > 1) {
         setQuantity(prev => +prev - 1);
      } else if (flag === "plus") {
         setQuantity(prev => +prev + 1);
      }
   }, [quantity]);

   const handleClickImage = (e, el) => {
      e.stopPropagation();
      setCurrentImage(el);
   }
   return (
      <div className={clsx("w-full")}>
         {!isQuickView && <div className="h-[81px] flex items-center justify-center bg-gray-100">
            <div className="w-main">
               <h3 className="font-semibold">{currentProduct.title || product?.title}</h3>
               <Breadcrumb
                  title={currentProduct.title || product?.title}
                  category={category}
               // category={product?.variants?.find(el => el.sku === variant)?.category || product?.title}
               />
            </div>
         </div>}
         <div
            onClick={e => e.stopPropagation()}
            className={clsx("bg-white m-auto mt-4 flex", isQuickView ? "max-w-[900px] gap-16 p-8 max-h-[80vh] overflow-auto" : "w-main")}
         >
            <div className={clsx("w-2/5 flex flex-col gap-4", isQuickView && "w-1/2")}>
               <div className="h-[458px] w-[458px] border flex items-center overflow-hidden">
                  <ReactImageMagnify {...{
                     smallImage: {
                        alt: "",
                        isFluidWidth: true,
                        src: variant ? currentProduct?.thumb : currentImage
                     },
                     largeImage: {
                        src: variant ? currentProduct?.thumb : currentImage,
                        width: 1800,
                        height: 1500,
                     }
                  }} />
               </div>
               <div className="w-[458px]">
                  <Slider className="image-slider flex gap-2 justify-between" {...settings}>
                     {currentProduct.images.length === 0 && product?.images?.map(el => (
                        <div className="flex-1" key={el}>
                           <img onClick={e => handleClickImage(e, el)} src={el} alt="sub-product" className="h-[143px] cursor-pointer w-[143px] border object-cover" />
                        </div>
                     ))}
                     {currentProduct.images.length > 0 && variant
                        ? currentProduct.images?.map(el => (
                           <div className="flex-1" key={el}>
                              <img onClick={e => handleClickImage(e, el)} src={el} alt="sub-product" className="h-[143px] cursor-pointer w-[143px] border object-cover" />
                           </div>
                        ))
                        : product?.images?.map(el => (
                           <div className="flex-1" key={el}>
                              <img onClick={e => handleClickImage(e, el)} src={el} alt="sub-product" className="h-[143px] cursor-pointer w-[143px] border object-cover" />
                           </div>
                        ))}
                  </Slider>
               </div>
            </div>
            <div className={clsx("w-2/5 pr-[24px] flex flex-col gap-4", isQuickView && "w-1/2")}>
               <div className="flex items-center justify-between">
                  <h2 className="text-[30px] font-semibold">{`${formatMoney(formatRoundPrice(variant ? currentProduct?.price : product?.price))} VND`}</h2>
                  <span className="text-sm text-main">{`Kho ${product?.quantity}`}</span>
               </div>
               <div className="flex items-center gap-1">
                  {renderStarFromNumber(product?.averageRating)?.map((el, index) => (<span key={index}>{el}</span>))}
                  <span className="text-sm text-main italic">{`(Đã bán: ${product?.sold} cái)`}</span>
               </div>
               <ul className="list-square text-sm text-gray-500 pl-4">
                  {product?.description?.length > 1 && product?.description?.map(el => (<li className="leading-6" key={el}>{el}</li>))}
                  {product?.description?.length === 1 && <div className="text-sm line-clamp-[10] mb-8" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description[0]) }}></div>}
               </ul>
               <div className="my-4 flex gap-4">
                  <span className="font-bold">Color:</span>
                  <div className="flex flex-wrap gap-4 items-center w-full">
                     <div
                        onClick={() => { setVariant(null) }}
                        className={clsx("flex items-center gap-2 p-2 border cursor-pointer", !variant && "border-red-500")}
                     >
                        <img src={product?.thumb} alt="thumb" className="w-8 h-8 rounded-md object-cover" />
                        <span className="flex flex-col">
                           <span>{product?.color}</span>
                           <span className="text-sm">{product?.price}</span>
                        </span>
                     </div>
                     {product?.variants?.map((el, index) => (
                        <div
                           onClick={() => { setVariant(el.sku) }}
                           key={index}
                           className={clsx("flex items-center gap-2 p-2 border cursor-pointer", variant === el.sku && "border-red-500")}
                        >
                           <img src={el?.thumb} alt="thumb" className="w-8 h-8 rounded-md object-cover" />
                           <span className="flex flex-col">
                              <span>{el?.color}</span>
                              <span className="text-sm">{el?.price}</span>
                           </span>
                        </div>
                     ))}
                  </div>
               </div>
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
            {!isQuickView && <div className=" w-1/5">
               {productExtraInformation?.map(el => (
                  <ProductExtraInfoItem
                     key={el.id}
                     title={el.title}
                     icon={el.icon}
                     sub={el.sub}
                  />
               ))}
            </div>}
         </div>
         {!isQuickView && <div className="w-main m-auto mt-8">
            <ProductInformation
               totalRatings={product?.averageRating}
               ratings={product?.ratings}
               productName={product?.title}
               pid={product?._id}
               rerender={rerender}
            />
         </div>}
         {!isQuickView && <>
            <div className="w-main m-auto mt-8">
               <h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">OTHER CUSTOMER ALSO LIKED</h3>
               <CustomSlider normal={true} products={relatedProducts} />
            </div>
            <div className="h-[100px] w-full"></div>
         </>}
      </div>
   )
}

export default ProductDetails;