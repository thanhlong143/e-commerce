import React, { Fragment, memo, useState } from "react";
import avatar from "assets/default-avatar.jpg";
import { memberSidebar } from "utils/contants";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { AiOutlineCaretDown, AiOutlineCaretRight } from "react-icons/ai";
import { useSelector } from "react-redux";

const activedStyle = "px-4 py-2 flex items-center gap-2 bg-blue-500 text-gray-100";
const notActivedStyle = "px-4 py-2 flex items-center gap-2 hover:bg-blue-100";

const MemberSidebar = () => {
   const [actived, setActived] = useState([]);
   const { current } = useSelector(state => state.user);
   const handleShowTabs = (tabId) => {
      if (actived.some(el => el === tabId)) { setActived(prev => prev.filter(el => el !== tabId)) }
      else { setActived(prev => [...prev, tabId]) }
   }

   return (
      <div className="bg-white h-full py-4 w-[250px] flex-none">
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
         </div>
      </div>
   )
}

export default memo(MemberSidebar)