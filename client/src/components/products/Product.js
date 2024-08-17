import React, { memo, useState } from "react";
import { formatMoney, renderStarFromNumber } from "utils/helpers";
import newLabel from "assets/new-label.png";
import trendingLabel from "assets/trending-label.png";
import defaultThumb from "assets/default-product-image.png";
import { SelectOption } from "..";
import icons from "utils/icons";
import { showModal } from "store/app/appSlice";
import { ProductDetails } from "pages/public";
import withBaseComponent from "hocs/withBaseComponent";
import { apiUpdateCart, apiUpdateWishlist } from "apis";
import { toast } from "react-toastify";
import { getCurrent } from "store/user/asyncActions";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import path from "utils/path";
import { createSearchParams } from "react-router-dom";
import clsx from "clsx";

const { AiFillEye, BsFillCartCheckFill, BsFillCartPlusFill, BsFillSuitHeartFill } = icons;

const Product = ({ productData, isNew, normal, navigate, dispatch, location, pid, className }) => {
   const [isShowOption, setIsShowOption] = useState(false);
   const { current } = useSelector(state => state.user);

   const handleClickOptions = async (e, flag) => {
      e.stopPropagation();
      if (flag === "CART") {
         if (!current) return Swal.fire({
            title: "Almost...",
            text: "Please login!",
            icon: "info",
            cancelButtonText: "Not now!",
            showCancelButton: true,
            confirmButtonText: "Go login",
         }).then((result) => {
            if (result.isConfirmed) navigate({
               pathname: `/${path.LOGIN}`,
               search: createSearchParams({ redirect: location.pathname }).toString()
            })
         })

         const response = await apiUpdateCart({
            pid: productData?._id,
            quantity: 1,
            color: productData?.color,
            price: productData?.price,
            thumbnail: productData?.thumbnail,
            title: productData?.title,
         })

         if (response.success) {
            toast.success(response.message);
            dispatch(getCurrent())
         }
         else toast.error(response.message)

      }
      if (flag === "WISHLIST") {
         const response = await apiUpdateWishlist(pid);
         if (response.success) {
            dispatch(getCurrent());
            toast.success(response.message)
         } else {
            toast.error(response.message);
         }
      }
      if (flag === "QUICK_VIEW") {
         dispatch(showModal({
            isShowModal: true,
            modalChildren: <ProductDetails data={{ pid: productData?._id, category: productData?.category }} isQuickView />
         }))
      }
   }

   return (
      <div className={clsx("w-full text-base px-[10px]", className)}>
         <div
            className="w-full border p-[15px] flex flex-col items-center"
            onClick={() => navigate(`/${productData?.category?.toLowerCase()}/${productData?._id}/${productData?.title}`)}
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
                  <span title="Quick view" onClick={(e) => { handleClickOptions(e, "QUICK_VIEW") }}>
                     <SelectOption icon={<AiFillEye />} />
                  </span>
                  {current?.cart?.some(el => el.product?._id === productData?._id)
                     ? <span title="Added to cart" >
                        <SelectOption icon={<BsFillCartCheckFill color="green" />} />
                     </span>
                     : <span title="Add to cart" onClick={(e) => { handleClickOptions(e, "CART") }}>
                        <SelectOption icon={<BsFillCartPlusFill />} />
                     </span>
                  }
                  <span title="Add to wishlist" onClick={(e) => { handleClickOptions(e, "WISHLIST") }}>
                     {<SelectOption icon={<BsFillSuitHeartFill color={current?.wishlist?.some(id => id._id === pid) ? "red" : ""} />} />}
                  </span>
               </div>}

               <img
                  src={productData?.thumbnail || defaultThumb}
                  alt=""
                  className="w-[274px] h-[274px] object-cover"
               />
               {!normal && <img src={isNew ? newLabel : trendingLabel} alt=""
                  className={
                     `absolute ${isNew
                        ? "w-[120px] top-[-15px] right-[-15px]"
                        : "w-[120px] top-[-15px] right-[-15px]"} object-contain
                     `
                  }
               />}
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

export default withBaseComponent(memo(Product));