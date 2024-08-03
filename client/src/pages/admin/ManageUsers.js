import { apiDeleteUser, apiGetUsers, apiUpdateUser } from "apis";
import React, { useCallback, useEffect, useState } from "react";
import { blockStatus, roles } from "utils/contants";
import moment from "moment";
import { Button, InputField, InputForm, Pagination, Select } from "components";
import useDebounce from "hooks/useDebounce";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import clsx from "clsx";

const ManageUsers = () => {
   const { handleSubmit, register, formState: { errors }, reset } = useForm({
      email: "",
      firstname: "",
      lastname: "",
      role: "",
      mobile: "",
      isBlocked: ""
   });
   const [users, setUsers] = useState(null);
   const [queries, setQueries] = useState({ q: "" });
   const [update, setUpdate] = useState(false);
   const [editElement, setEditElement] = useState(null);
   const [params] = useSearchParams();
   const fetchUsers = async (params) => {
      const response = await apiGetUsers({ ...params, limit: +process.env.REACT_APP_LIMIT });
      if (response.success) { setUsers(response); }
   }
   const render = useCallback(() => {
      setUpdate(!update);
   }, [update])
   const queriesDebounce = useDebounce(queries.q, 800);
   useEffect(() => {
      const queries = Object.fromEntries([...params]);
      if (queriesDebounce) { params.q = queriesDebounce }
      fetchUsers(queries)
   }, [queriesDebounce, params, update]);

   const handleUpdate = async (data) => {
      const response = await apiUpdateUser(data, editElement._id);
      if (response.success) {
         setEditElement(null);
         render();
         toast.success(response.message);
      } else {
         toast.error(response.message);
      }
   }

   const handleDeleteUser = (uid) => {
      Swal.fire({
         title: "Bạn có chắc chắn...",
         text: "Bạn có chắc chắn muốn xoá người dùng này không?",
         showCancelButton: true
      }).then(async (result) => {
         if (result.isConfirmed) {
            const response = await apiDeleteUser(uid);
            if (response.success) {
               render();
               toast.success(response.message);
            } else {
               toast.error(response.message);
            }
         }
      })
   }

   // useEffect(() => {
   //    if (editElement) {
   //       reset({
   //          role: editElement.role,
   //          isBlocked: editElement.isBlocked
   //       })
   //    }
   // }, [editElement])

   return (
      <div className={clsx("w-full pl-8", editElement && "pl-16")}>
         <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
            <span>Manage users</span>
         </h1>
         <div className="w-full p-4">
            <div className="flex justify-end py-4">
               <InputField
                  nameKey={"q"}
                  value={queries.q}
                  setValue={setQueries}
                  style={"w500"}
                  placeholder={"Tìm kiếm tên người dùng"}
                  isHideLabel
               />
            </div>
            <form onSubmit={handleSubmit(handleUpdate)}>
               {editElement && <Button type="submit" >Update</Button>}
               <table className="table-auto mb-6 text-left w-full">
                  <thead className="font-bold bg-gray-700 text-[13px] text-white">
                     <tr className="border border-gray-500">
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Firstname</th>
                        <th className="px-4 py-2">Lastname</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Phone</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Updated At</th>
                        <th className="px-4 py-2">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     {users?.users.map((el, index) => (
                        <tr key={el._id} className="border border-gray-500" >
                           <td className="py-2 px-4">{index + 1}</td>
                           <td className="py-2 px-4">
                              {editElement?._id === el._id ? <InputForm
                                 register={register}
                                 fullWidth
                                 errors={errors}
                                 defaultValue={editElement?.email}
                                 id={"email"}
                                 validate={{
                                    required: "Vui lòng điền địa chỉ email",
                                    pattern: {
                                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                       message: "Địa chỉ email không hợp lệ"
                                    }
                                 }}
                              /> : <span>{el.email}</span>}
                           </td>
                           <td className="py-2 px-4">
                              {editElement?._id === el._id ? <InputForm
                                 register={register}
                                 fullWidth
                                 errors={errors}
                                 defaultValue={editElement?.firstname}
                                 id={"firstname"}
                                 validate={{ required: "Vui lòng điền tên" }}
                              /> : <span>{el.firstname}</span>}
                           </td>
                           <td className="py-2 px-4">
                              {editElement?._id === el._id ? <InputForm
                                 register={register}
                                 fullWidth
                                 errors={errors}
                                 defaultValue={editElement?.lastname}
                                 id={"lastname"}
                                 validate={{ required: "Vui lòng điền họ" }}
                              /> : <span>{el.lastname}</span>}
                           </td>
                           <td className="py-2 px-4">
                              {editElement?._id === el._id
                                 ? <Select
                                    register={register}
                                    fullWidth
                                    errors={errors}
                                    defaultValue={el.role}
                                    id={"role"}
                                    validate={{ required: "Vui lòng chọn" }}
                                    option={roles}
                                 />
                                 : <span>{roles.find(role => +role.code === +el.role)?.value}</span>}
                           </td>
                           <td className="py-2 px-4">
                              {editElement?._id === el._id ? <InputForm
                                 register={register}
                                 fullWidth
                                 errors={errors}
                                 defaultValue={editElement?.mobile}
                                 id={"mobile"}
                                 validate={{
                                    required: "Vui lòng điền số điện thoại",
                                    pattern: {
                                       value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
                                       message: "Số điện thoại không hợp lệ"
                                    }
                                 }}
                              /> : <span>{el.mobile}</span>}
                           </td>
                           <td className="py-2 px-4">
                              {editElement?._id === el._id
                                 ? <Select
                                    register={register}
                                    fullWidth
                                    errors={errors}
                                    defaultValue={el.isBlocked}
                                    id={"isBlocked"}
                                    validate={{ required: "Vui lòng chọn" }}
                                    option={blockStatus}
                                 />
                                 : <span>{el.isBlocked ? "Blocked" : "Active"}</span>}
                           </td>
                           <td className="py-2 px-4">
                              {moment(el.updatedAt).format("DD/MM/YYYY")}
                           </td>
                           <td className="py-2 px-4">
                              {editElement?._id === el._id
                                 ? <span onClick={() => { setEditElement(null) }} className="px-2 text-orange-600 hover:underline cursor-pointer">Cancel</span>
                                 : <span onClick={() => { setEditElement(el) }} className="px-2 text-orange-600 hover:underline cursor-pointer">Edit</span>}
                              <span onClick={() => { handleDeleteUser(el._id) }} className="px-2 text-orange-600 hover:underline cursor-pointer">Delete</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </form>
            <div className="w-full flex justify-end">
               <Pagination
                  totalCount={users?.count}
               />
            </div>
         </div>
      </div>
   )
}

export default ManageUsers