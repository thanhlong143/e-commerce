import React, { Fragment, memo, useState } from "react";
import avatar from "assets/default-avatar.jpg";
import { memberSidebar } from "utils/contants";
import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import { useSelector } from "react-redux";
import withBaseComponent from "hocs/withBaseComponent";
import { logout } from "store/user/userSlice";
import icons from "utils/icons";
import logo from "assets/logo.png";

const { AiOutlineLogout } = icons;

const activedStyle = "px-4 py-2 flex items-center gap-2 bg-blue-500 text-gray-100";
const notActivedStyle = "px-4 py-2 flex items-center gap-2 hover:bg-blue-100";

const MemberSidebar = ({ dispatch }) => {
   const [actived, setActived] = useState([]);
   const { current } = useSelector(state => state.user);
   const handleShowTabs = (tabId) => {
      if (actived.some(el => el === tabId)) { setActived(prev => prev.filter(el => el !== tabId)) }
      else { setActived(prev => [...prev, tabId]) }
   }

   return (
      <div className="bg-white h-screen py-4 w-[250px] flex-none">
         <Link to={"/"} className="flex flex-col justify-center items-center p-4 gap-2">
            <img src={logo} alt="logo" className="w-[200px] object-contain" />
         </Link>
         <div className="w-full flex flex-col items-center justify-center py-4">
            <img src={current?.avatar || avatar} alt="avatar" className="w-16 h-16 object-cover rounded-full" />
            <small>{`${current?.lastname} ${current?.firstname}`}</small>
         </div>
         <div>
            {memberSidebar.map(el => (
               <Fragment key={el.id}>
                  {el.type === "SINGLE" && <NavLink className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle)} to={el.path}>
                     <span>{el.icon}</span>
                     <span>{el.text}</span>
                  </NavLink>}
                  {el.type === "PARENT" && <div onClick={() => handleShowTabs(+el.id)} className="flex flex-col">
                     <div className="flex items-center justify-between px-4 py-2 hover:bg-blue-100 cursor-pointer">
                        <div className="flex items-center gap-2">
                           <span>{el.icon}</span>
                           <span>{el.text}</span>
                        </div>
                        {actived.some(id => +id === +el.id) ? <AiOutlineCaretDown /> : <AiOutlineCaretRight />}
                     </div>
                     {actived.some(id => +id === +el.id) && <div className="flex flex-col">
                        {el.submenu.map(item => (
                           <NavLink
                              className={({ isActive }) => clsx(isActive && activedStyle, !isActive && notActivedStyle, "pl-10")}
                              key={item.text}
                              to={item.path}
                              onClick={e => e.stopPropagation()}
                           >
                              {item.text}
                           </NavLink>
                        ))}
                     </div>}
                  </div>}
               </Fragment>
            ))}
            <NavLink to={"/"} >
               Go Home
            </NavLink>
         </div>
         <div
            className="flex items-center justify-center py-2 my-80 text-main hover:bg-red-100 cursor-pointer"
            onClick={() => dispatch(logout())}
         >
            <div className="flex items-center gap-2">
               <span>Đăng Xuất</span>
               <span><AiOutlineLogout /></span>
            </div>
         </div>
      </div>
   )
}

export default withBaseComponent(memo(MemberSidebar))