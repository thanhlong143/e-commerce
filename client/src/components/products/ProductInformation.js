import React, { memo, useState } from "react";
import { productInfoTabs } from "utils/contants";
import { Votebar, Button, VoteOption, Comment } from "..";
import { renderStarFromNumber } from "utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { showModal } from "store/app/appSlice";
import { apiRatings } from "apis";
import Swal from "sweetalert2";
import path from "utils/path";
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
      await apiRatings({ star: score, comment, pid, updatedAt: Date.now() });
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

         </div>
         <div className="w-full border p-4">
            {productInfoTabs?.some(el => el.id === activedTab) && productInfoTabs[activedTab - 1]?.content}
         </div>
         <div className="flex flex-col py-8 w-main">
            <div className="flex border">
               <div className="flex-4 flex-col flex items-center justify-center">
                  <span className="font-semibold text-3xl">{`${totalRatings}/5`}</span>
                  <span className="flex items-center gap-1">{renderStarFromNumber(totalRatings)?.map((el, index) => (
                     <span key={index}>{el}</span>
                  ))}</span>
                  <span className="text-sm">{`${ratings?.length} reviewers`}</span>
               </div>
               <div className="flex-6 flex gap-2 flex-col p-4">
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
            <div className="flex flex-col gap-4">
               {ratings?.map(el => (
                  <Comment
                     key={el._id}
                     star={el.star}
                     updatedAt={el.updatedAt}
                     comment={el.comment}
                     name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
                  />
               ))}
            </div>
         </div>
      </div>
   )
}

export default memo(ProductInformation)