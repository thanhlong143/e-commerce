import clsx from "clsx"
import { Button, InputForm } from "components"
import moment from "moment"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux";
import avatar from "assets/default-avatar.jpg";
import { apiUpdateCurrent } from "apis"
import { getCurrent } from "store/user/asyncActions"
import { toast } from "react-toastify"
import withBaseComponent from "hocs/withBaseComponent"
import { useSearchParams } from "react-router-dom"

const Personal = ({ navigate, dispatch }) => {
   const { register, formState: { errors, isDirty }, handleSubmit, reset } = useForm()
   const { current } = useSelector(state => state.user);
   const [searchParams] = useSearchParams();

   useEffect(() => {
      reset({
         firstname: current?.firstname,
         lastname: current?.lastname,
         mobile: current?.mobile,
         email: current?.email,
         avatar: current?.avatar || avatar,
         address: current?.address,
      })
   }, [current])

   const handleUpdateInfo = async (data) => {
      const formData = new FormData();
      if (data.avatar.length > 0) { formData.append("avatar", data.avatar[0]) }
      delete data.avatar;
      for (let i of Object.entries(data)) { formData.append(i[0], i[1]) }

      const response = await apiUpdateCurrent(formData);
      if (response.success) {
         dispatch(getCurrent());
         toast.success(response.message);
         if (searchParams.get("redirect")) navigate(searchParams.get("redirect"))
      } else { toast.error(response.message) }
   }
   console.log(searchParams.get("redirect"));
   return (
      <div className="w-full relative px-4">
         <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
            Personal
         </header>
         <form onSubmit={handleSubmit(handleUpdateInfo)}>
            <div className="flex py-8 border-b border-b-blue-200">
               <div className="w-2/3 mx-auto px-16 py-4 flex flex-col gap-6 border-r border-r-blue-200">
                  <InputForm
                     label={"Firstname"}
                     register={register}
                     errors={errors}
                     id={"firstname"}
                     validate={{
                        required: "Need fill"
                     }}
                  />
                  <InputForm
                     label={"Lastname"}
                     register={register}
                     errors={errors}
                     id={"lastname"}
                     validate={{
                        required: "Need fill"
                     }}
                  />
                  <InputForm
                     label={"Email"}
                     register={register}
                     errors={errors}
                     id={"email"}
                     validate={{
                        required: "Need fill",
                        pattern: {
                           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                           message: "Địa chỉ email không hợp lệ"
                        }
                     }}
                  />
                  <InputForm
                     label={"Mobile Number"}
                     register={register}
                     errors={errors}
                     id={"mobile"}
                     validate={{
                        required: "Need fill",
                        pattern: {
                           value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                           message: "Số điện thoại không hợp lệ"
                        }
                     }}
                  />
                  <InputForm
                     label={"Address"}
                     register={register}
                     errors={errors}
                     id={"address"}
                     validate={{
                        required: "Need fill"
                     }}
                  />
               </div>
               <div className="w-1/3 flex flex-col">
                  <div className="flex items-center justify-center py-16">
                     <label htmlFor="file" className="flex flex-col justify-center items-center cursor-pointer">
                        <img src={current?.avatar || avatar} alt="avatar" className="w-32 h-32 object-cover rounded-full mb-2" />
                        <div className="w-24 h-8 flex items-center justify-center border border-gray-300 hover:bg-gray-300 rounded-md">Chọn ảnh</div>
                     </label>
                     <input type="file" id="file" {...register("avatar")} hidden />
                  </div>
                  <div className="flex flex-col mx-auto gap-2">
                     <div className="flex items-center gap-2">
                        <span>Account status:</span>
                        <span className={clsx(current?.isBlocked ? "text-red-500" : "text-green-500")}>{current?.isBlocked ? "Blocked" : "Actived"}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span>Role:</span>
                        <span>{+current?.role === 2002 ? "Admin" : "User"}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span>Created At:</span>
                        <span>{moment(current?.createdAt).fromNow()}</span>
                     </div>
                  </div>
               </div>
            </div>
            {isDirty && <div className="flex items-center justify-center py-10">
               <Button type="submit" >Update Info</Button>
            </div>}
         </form>
      </div>
   )
}

export default withBaseComponent(Personal)