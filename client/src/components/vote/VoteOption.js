import React, { memo, useEffect, useRef, useState } from "react";
import logo from "assets/logo.png";
import { voteOptions } from "utils/contants";
import { AiFillStar } from "react-icons/ai";
import { Button } from "..";

const VoteOption = ({ productName, handleSubmitVoteOptions }) => {
   const modalRef = useRef();
   const [chosenScore, setChosenScore] = useState(null);
   const [comment, setComment] = useState("");

   useEffect(() => {
      modalRef.current.scrollIntoView({ block: "center", behavior: "smooth" })
   }, []);

   return (
      <div onClick={e => e.stopPropagation()} ref={modalRef} className="bg-white w-[700px] p-4 gap-4 flex-col flex items-center justify-center">
         <img src={logo} alt="logo" className="w-[300px] my-8 object-contain" />
         <h2 className="text-center text-lg">{`Đánh giá sản phẩm ${productName}`}</h2>
         <textarea
            placeholder="Type something"
            className="form-textarea w-full placeholder:italic placeholder:text-xs placeholder:text-gray-500 text-sm"
            value={comment}
            onChange={e => setComment(e.target.value)}
         ></textarea>
         <div className="w-full flex flex-col gap-4">
            <p>Bạn cảm thấy sản phẩm này như thế nào?</p>
            <div className="flex justify-center gap-4 items-center">
               {voteOptions?.map(el => (
                  <div onClick={() => setChosenScore(el.id)} className="w-[110px] bg-gray-200 cursor-pointer rounded-md p-4 flex items-center justify-center flex-col gap-2" key={el.id}>
                     {(Number(chosenScore) && Number(chosenScore) >= el.id) ? <AiFillStar color="orange" /> : <AiFillStar color="gray" />}
                     <span>{el.text}</span>
                  </div>
               ))}
            </div>
         </div>
         <Button handleOnClick={() => handleSubmitVoteOptions({ comment, score: chosenScore })} fw >Submit</Button>
      </div>
   )
}

export default memo(VoteOption);