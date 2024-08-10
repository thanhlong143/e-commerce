import React, { memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import path from "utils/path";
import { getCurrent } from "store/user/asyncActions";
import { useDispatch, useSelector } from "react-redux";
import icons from "utils/icons";
import { logout, clearMessage } from "store/user/userSlice";
import Swal from "sweetalert2";
import defaultAvatar from "assets/default-avatar.jpg";

const { AiOutlineLogout } = icons;

const TopHeader = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const { isLoggedIn, current, message } = useSelector(state => state.user);

   useEffect(() => {
      const setTimeoutId = setTimeout(() => {
         if (isLoggedIn) {
            dispatch(getCurrent());
         }
      }, 300);
      return () => {
         clearTimeout(setTimeoutId);
      }
   }, [dispatch, isLoggedIn]);

   useEffect(() => {
      if (message) {
         Swal.fire("Oops!", message, "info").then(() => {
            dispatch(clearMessage());
            navigate(`/${path.LOGIN}`);
         })
      }
   }, [message]);

   return (
      <div className="h-[38px] w-full bg-main flex items-center justify-center">
         <div className="w-main flex items-center justify-between text-xs text-white">
            <span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
            {isLoggedIn && current
               ? <div className="flex text-sm gap-1 items-center justify-center">
                  <span className="flex items-center justify-center gap-1">
                     <img className="w-7 h-7 object-cover rounded-full" src={current?.avatar || defaultAvatar} />
                     {`${current?.lastname} ${current?.firstname}`}
                  </span>
                  <span
                     onClick={() => dispatch(logout())}
                     className="hover:rounded-full hover:bg-gray-200 hover:text-main cursor-pointer p-2"
                  >
                     <AiOutlineLogout size={18} />
                  </span>
               </div>
               : <Link className="hover:text-gray-800" to={`${path.LOGIN}`}>Sign In or Create Account</Link>}
         </div>
      </div>
   )
}

export default memo(TopHeader);