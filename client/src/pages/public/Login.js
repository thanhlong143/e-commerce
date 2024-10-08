import React, { useCallback, useEffect, useState } from "react";
import { Button, InputField, Loading } from "components";
import { apiFinalRegister, apiForgotPassword, apiLogin, apiRegister } from "apis";
import Swal from "sweetalert2";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import path from "utils/path";
import { useDispatch } from "react-redux";
import { login } from "store/user/userSlice";
import { showModal } from "store/app/appSlice";
import { toast } from "react-toastify";
import { validate } from "utils/helpers";

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
   const [isVerifiedEmail, setIsVerifiedEmail] = useState(false);
   const [token, setToken] = useState("");
   const [invalidFields, setInvalidFields] = useState("");
   const [isRegister, setIsRegister] = useState(false);
   const [isForgotPassword, setIsForgotPassword] = useState(false);
   
   const[searchParams]=useSearchParams()
   
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
            dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }));
            const response = await apiRegister(payload);
            dispatch(showModal({ isShowModal: false, modalChildren: null }));
            if (response.success) {
               setIsVerifiedEmail(true);
            } else {
               Swal.fire("Oops", response.message, "error");
            }
         } else {
            const result = await apiLogin(data);
            if (result.success) {
               dispatch(login({ isLoggedIn: true, access_token: result.accessToken, userData: result.userData }));
               searchParams.get("redirect") ? navigate(searchParams.get("redirect")) : navigate(`/${path.HOME}`);
            } else {
               Swal.fire("Oops", result.message, "error");
            }
         }
      }
   }, [payload, isRegister, navigate, dispatch]);

   const finalRegister = async () => {
      const response = await apiFinalRegister(token);
      if (response.success) {
         Swal.fire("Congratulations", response.message, "success").then(() => {
            setIsRegister(false);
            resetPayload();
         });
      } else {
         Swal.fire("Oops", response.message, "error");
      }
      setIsVerifiedEmail(false);
      setToken("");
   }

   return (
      <div className="w-screen h-screen relative flex justify-center">
         {isVerifiedEmail && <div className="absolute top-0 left-0 right-0 bottom-0 bg-overlay z-50 flex flex-col items-center justify-center">
            <div className="bg-white w-[500px] rounded-md p-8">
               <h4>Mã xác thực đã được gửi vào email của bạn. Hãy kiểm tra email và nhập mã xác thực:</h4>
               <input type="text" value={token} onChange={e => setToken(e.target.value)} className="p-2 border rounded-md outline-none" />
               <button
                  onClick={finalRegister}
                  type="button"
                  className="px-4 py-2 bg-main font-semibold text-white rounded-md ml-4"
               >
                  Submit
               </button>
            </div>
         </div>}
         {isForgotPassword && <div className="absolute animate-slide-left top-0 left-0 bottom-0 right-0 bg-white flex flex-col items-center py-8 z-50">
            <div className="flex flex-col gap-4">
               <label htmlFor="email">Nhập địa chỉ email của bản: </label>
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
         <div src="" alt="" className="w-full h-full object-cover bg-main" />
         <div className="absolute top-0 bottom-0 items-center justify-center flex">
            <div className="p-8 bg-white flex flex-col rounded-md min-w-[500px]">
               <h1 className="text-[28px] font-semibold text-main mb-8">{isRegister ? "Đăng ký" : "Đăng nhập"}</h1>
               {isRegister && <div className="flex items-center gap-2">
                  <InputField
                     value={payload.lastname}
                     setValue={setPayload}
                     placeholder={"Họ"}
                     nameKey="lastname"
                     invalidFields={invalidFields}
                     setInvalidFields={setInvalidFields}
                  />
                  <InputField
                     value={payload.firstname}
                     setValue={setPayload}
                     placeholder={"Tên"}
                     nameKey="firstname"
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
                  placeholder={"Số điện thoại"}
                  nameKey="mobile"
                  invalidFields={invalidFields}
                  setInvalidFields={setInvalidFields}
               />}
               <InputField
                  value={payload.password}
                  setValue={setPayload}
                  placeholder={"Mật khẩu"}
                  nameKey="password"
                  type="password"
                  invalidFields={invalidFields}
                  setInvalidFields={setInvalidFields}
               />
               <Button
                  handleOnClick={handleSubmit}
                  fw
               >
                  {isRegister ? "Đăng ký" : "Đăng nhập"}
               </Button>
               <div className="flex items-center justify-between my-2 w-full text-sm">
                  {!isRegister && <span onClick={() => setIsForgotPassword(true)} className="text-blue-500 hover:underline cursor-pointer">
                     Quên mật khẩu?
                  </span>}
                  {!isRegister && <span
                     className="text-blue-500 hover:underline cursor-pointer"
                     onClick={() => { setIsRegister(true) }}
                  >Tạo tài khoản mới</span>}
                  {isRegister && <span
                     className="text-blue-500 hover:underline cursor-pointer w-full text-center"
                     onClick={() => { setIsRegister(false) }}
                  >Đi đến trang đăng nhập</span>}
               </div>
               <Link className="text-blue-500 text-sm hover:underline cursor-pointer w-full text-center" to={`/${path.HOME}`}>
                  Đi đến trang chủ?
               </Link>
            </div>
         </div>
      </div>
   )
}

export default Login;