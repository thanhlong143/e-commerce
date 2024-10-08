import { Breadcrumb, Button, OrderItem } from "components";
import withBaseComponent from "hocs/withBaseComponent";
import React from "react"
import { useSelector } from "react-redux"
import { createSearchParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { formatMoney } from "utils/helpers";
import path from "utils/path";

const CartDetails = ({ location, navigate }) => {
   const { currentCart, current } = useSelector(state => state.user);

   const handleSubmit = () => {
      if (!current?.address) {
         return Swal.fire({
            icon: "info",
            title: "Almost!",
            text: "Vui lòng cập nhật địa chỉ giao hàng!",
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: "Cập nhật",
            cancelButtonText: "Huỷ"
         }).then((result) => {
            if (result.isConfirmed) navigate({
               pathname: `/${path.MEMBER}/${path.PERSONAL}`,
               search: createSearchParams({ redirect: location.pathname }).toString()
            })
         })
      } else {
         window.open(`/${path.CHECKOUT}`, "_blank")
      }
   }

   return (
      <div className="w-full">
         <div className="h-[81px] flex items-center justify-center bg-gray-100">
            <div className="w-main">
               <h3 className="font-semibold text-2xl uppercase">My Cart</h3>
               <Breadcrumb category={location?.pathName} />
            </div>
         </div>
         <div className="flex flex-col border my-8 w-main mx-auto">
            <div className="w-main m-auto bg-main opacity-90 text-white font-bold py-3 grid grid-cols-10">
               <span className="col-span-6 w-full text-center">Products</span>
               <span className="col-span-1 w-full text-center">Quantity</span>
               <span className="col-span-3 w-full text-center">Price</span>
            </div>
            {currentCart?.map(el => (
               <OrderItem
                  key={el._id}
                  defaultQuantity={el.quantity}
                  color={el.color}
                  title={el.title}
                  thumbnail={el.thumbnail}
                  price={el.price}
                  pid={el.product?._id}
               />
            ))}
         </div>
         <div className="w-main mx-auto mb-12 flex flex-col justify-center items-end gap-3">
            <span className="flex items-center gap-8 text-sm">
               <span>Subtotal:</span>
               <span className="text-main font-bold">{(`${formatMoney(currentCart?.reduce((sum, el) => +el.price * el.quantity + sum, 0))}`)} VND</span>
            </span>
            <span className="text-xs italic">{currentCart.length === 0
               ? "Bạn chưa có sản phẩm nào trong giỏ hàng!"
               : "Shipping, taxes, and discounts calculated at checkout"}
            </span>
            {currentCart.length === 0
               ? <Button>ĐẾN MUA HÀNG</Button>
               : <Button handleOnClick={handleSubmit}>Checkout</Button>
            }
            {/* {currentCart.length === 0
               ? <Link className="bg-main text-white px-4 py-2 rounded-md" to={`/${path.HOME}`}>ĐẾN MUA HÀNG</Link>
               : <Link target="_blank" className="bg-main text-white px-4 py-2 rounded-md" to={`/${path.CHECKOUT}`}>CHECK OUT</Link>
            } */}
         </div>
      </div>
   )
}

export default withBaseComponent(CartDetails)