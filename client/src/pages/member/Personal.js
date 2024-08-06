import clsx from "clsx"
import { Button, InputForm } from "components"
import moment from "moment"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"

const Personal = () => {
   const { register, formState: { errors }, handleSubmit, reset } = useForm()
   const { current } = useSelector(state => state.user);
   useEffect(() => {
      reset({
         firstname: current?.firstname,
         lastname: current?.lastname,
         mobile: current?.mobile,
         email: current?.email,
         avatar: current?.avatar
      })
   }, [current])

   const handleUpdateInfo = (data) => {
      console.log(data);
   }

   return (
      <div className="w-full relative px-4">
         <header className="text-3xl font-semibold py-4 border-b border-b-blue-200">
            Personal
         </header>
         <form onSubmit={handleSubmit(handleUpdateInfo)} className="w-4/5 mx-auto py-8 flex flex-col gap-4">
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
                  required: "Need fill"
               }}
            />
            <InputForm
               label={"Mobile Number"}
               register={register}
               errors={errors}
               id={"mobile"}
               validate={{
                  required: "Need fill"
               }}
            />
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
            <div className="w-full flex justify-end">
               <Button type="submit" >Update Info</Button>
            </div>
         </form>
      </div>
   )
}

export default Personal