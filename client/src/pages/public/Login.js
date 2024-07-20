import React, { useCallback, useEffect, useState } from "react";
import { Button, InputField } from "../../components";
import { apiForgotPassword, apiLogin, apiRegister } from "../../apis/user";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { useDispatch } from "react-redux";
import { login } from "../../store/user/userSlice";
import { toast } from "react-toastify";
import { validate } from "../../utils/helpers";

const Login = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();

   const [payload, setPayload] = useState({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
   });
   const [invalidFields, setInvalidFields] = useState("");
   const [isRegister, setIsRegister] = useState(false);
   const [isForgotPassword, setIsForgotPassword] = useState(false);
   const resetPayload = () => {
      setPayload({
         email: "",
         password: "",
         firstname: "",
         lastname: "",
         mobile: "",
      })
   }
   const [email, setEmail] = useState("")
   const handleForgotPassword = async () => {
      const response = await apiForgotPassword({ email });
      if (response.success) {
         toast.success(response.message, { theme: "colored" });
      } else {
         toast.info(response.message, { theme: "colored" });
      }
   }
   useEffect(() => {
      resetPayload();
   }, [isRegister])
   const handleSubmit = useCallback(async () => {
      const { firstname, lastname, mobile, ...data } = payload;
      const invalids = isRegister ? validate(payload, setInvalidFields) : validate(data, setInvalidFields);
      if (invalids === 0) {
         if (isRegister) {
            const response = await apiRegister(payload);
            if (response.success) {
               Swal.fire("Congratulations", response.message, "success").then(() => {
                  setIsRegister(false);
                  resetPayload();
               });
            } else {
               Swal.fire("Oops", response.message, "error");
            }
         } else {
            const result = await apiLogin(data);
            if (result.success) {
               dispatch(login({ isLoggedIn: true, access_token: result.accessToken, userData: result.userData }));
               navigate(`/${path.HOME}`);
            } else {
               Swal.fire("Oops", result.message, "error");
            }
         }
      }
   }, [payload, isRegister, navigate, dispatch]);
   return (
      <div className="w-screen h-screen relative">
         {isForgotPassword && <div className="absolute animate-slide-left top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50">
            <div className="flex flex-col gap-4">
               <label htmlFor="email">Enter your email: </label>
               <input type="text" id="email"
                  className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
               />
               <div className="flex items-center justify-end w-full gap-4">
                  <Button name="Submit" handleOnClick={handleForgotPassword} />
                  <Button name="Back" handleOnClick={() => setIsForgotPassword(false)} />
               </div>
            </div>
         </div>}
         {/* <img src="" alt="" className="w-full h-full object-cover bg-main" /> */}
         <div src="" alt="" className="w-full h-full object-cover bg-main" />
         <div className="absolute top-0 bottom-0 left-0 right-1/2 items-center justify-center flex">
            <div className="p-8 bg-white flex flex-col rounded-md min-w-[500px]">
               <h1 className="text-[28px] font-semibold text-main mb-8">{isRegister ? "Register" : "Login"}</h1>
               {isRegister && <div className="flex items-center gap-2">
                  <InputField
                     value={payload.firstname}
                     setValue={setPayload}
                     nameKey="firstname"
                     invalidFields={invalidFields}
                     setInvalidFields={setInvalidFields}
                  />
                  <InputField
                     value={payload.lastname}
                     setValue={setPayload}
                     nameKey="lastname"
                     invalidFields={invalidFields}
                     setInvalidFields={setInvalidFields}
                  />
               </div>}
               <InputField
                  value={payload.email}
                  setValue={setPayload}
                  nameKey="email"
                  invalidFields={invalidFields}
                  setInvalidFields={setInvalidFields}
               />
               {isRegister && <InputField
                  value={payload.mobile}
                  setValue={setPayload}
                  nameKey="mobile"
                  invalidFields={invalidFields}
                  setInvalidFields={setInvalidFields}
               />}
               <InputField
                  value={payload.password}
                  setValue={setPayload}
                  nameKey="password"
                  type="password"
                  invalidFields={invalidFields}
                  setInvalidFields={setInvalidFields}
               />
               <Button
                  name={isRegister ? "Register" : "Login"}
                  handleOnClick={handleSubmit}
                  fw
               />
               <div className="flex items-center justify-between my-2 w-full text-sm">
                  {!isRegister && <span onClick={() => setIsForgotPassword(true)} className="text-blue-500 hover:underline cursor-pointer">Forgot your password?</span>}
                  {!isRegister && <span
                     className="text-blue-500 hover:underline cursor-pointer"
                     onClick={() => { setIsRegister(true) }}
                  >Create account</span>}
                  {isRegister && <span
                     className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                     onClick={() => { setIsRegister(false) }}
                  >Go login</span>}
               </div>
            </div>
         </div>
      </div>
   )
}

export default Login;