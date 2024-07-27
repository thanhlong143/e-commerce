import React, { memo, useCallback, useState } from "react";
import { productInfoTabs } from "../utils/contants";
import { Votebar, Button, VoteOption } from "./";
import { renderStarFromNumber } from "../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "../store/app/appSlice";
import { apiRatings } from "../apis";
import Swal from "sweetalert2";
import path from "../utils/path";
import { useNavigate } from "react-router-dom";

const ProductInformation = ({ totalRatings, ratings, productName, pid, rerender }) => {
   const [activedTab, setActivedTab] = useState(1);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { isLoggedIn } = useSelector(state => state.user);

   const handleSubmitVoteOptions = async ({ comment, score }) => {
      if (!comment || !pid || !score) {
         alert("Please vote when click submit");
         return;
      }
      await apiRatings({ star: score, comment, pid });
      dispatch(showModal({ isShowModal: false, modalChildren: null }))
      rerender();
   };

   const handleVoteNow = () => {
      if (!isLoggedIn) {
         Swal.fire({
            text: "Oops!",
            cancelButtonText: "Cancel",
            confirmButtonText: "Go login",
            title: "Oops",
            showCancelButton: true
         }).then((result) => {
            if (result.isConfirmed) {
               navigate(`/${path.LOGIN}`);
            }
         })
      } else {
         dispatch(showModal({
            isShowModal: true, modalChildren: <VoteOption
               productName={productName}
               handleSubmitVoteOptions={handleSubmitVoteOptions}
            />
         }))
      }
   }

   return (
      <div>
         <div className="flex items-center gap-2 relative bottom-[-1px]">
            {productInfoTabs?.map(el => (
               <span
                  className={`py-2 px-4 cursor-pointer ${activedTab === +el.id ? "bg-white border border-b-0" : "bg-gray-200"}`}
                  key={el.id}
                  onClick={() => setActivedTab(el.id)}
               >
                  {el.name}
               </span>
            ))}
            <div
               className={`py-2 px-4 cursor-pointer ${activedTab === 5 ? "bg-white border border-b-0" : "bg-gray-200"}`}
               onClick={() => setActivedTab(5)}
            >
               CUSTOMER REVIEW
            </div>
         </div>
         <div className="w-full border p-4">
            {productInfoTabs?.some(el => el.id === activedTab) && productInfoTabs[activedTab - 1]?.content}
            {activedTab === 5 && <div className="flex flex-col p-4">
               <div className="flex">
                  <div className="flex-4 border flex-col flex items-center justify-center border-red-500">
                     <span className="font-semibold text-3xl">{`${totalRatings}/5`}</span>
                     <span className="flex items-center gap-1">{renderStarFromNumber(totalRatings)?.map((el, index) => (
                        <span key={index}>{el}</span>
                     ))}</span>
                     <span className="text-sm">{`${ratings?.length} reviewers`}</span>
                  </div>
                  <div className="flex-6 border flex gap-2 flex-col p-4">
                     {Array.from(Array(5).keys()).reverse().map(el => (
                        <Votebar
                           key={el}
                           number={el + 1}
                           totalRatings={ratings?.length}
                           ratingsCount={ratings?.filter(i => i.star === el + 1)?.length}
                        />
                     ))}
                  </div>
               </div>
               <div className="p-4 flex items-center justify-center text-sm flex-col gap-2">
                  <span>Bạn có muốn thêm nhận xét về sản phẩm này?</span>
                  <Button handleOnClick={handleVoteNow}
                  >
                     Vote Now!
                  </Button>
               </div>
            </div>}
         </div>
      </div>
   )
}

export default memo(ProductInformation)