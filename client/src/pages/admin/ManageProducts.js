import { apiGetProducts } from "apis";
import { InputForm, Pagination } from "components"
import moment from "moment";
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const ManageProducts = () => {
   const { register, formState: { errors }, handleSubmit, reset } = useForm();
   const [products, setProducts] = useState(null);
   const [count, setCount] = useState(0);

   const handleSearchProducts = (data) => {
      console.log(data);
   }

   const fetchProducts = async (params) => {
      const response = await apiGetProducts({ ...params, limit: process.env.REACT_APP_LIMIT });
      if (response.success) {
         setCount(response.count);
         setProducts(response.products);
      }
   }

   useEffect(() => {
      fetchProducts();
   }, []);


   return (
      <div className="w-full flex flex-col gap-4 relative" >
         <div className="h-[69px] w-full"></div>
         <div className="p-4 border-b w-full bg-gray-100 flex justify-between items-center fixed top-0">
            <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
         </div>
         <div className="flex w-full justify-end items-center px-4">
            <form className="w-[45%]" onSubmit={handleSubmit(handleSearchProducts)}>
               <InputForm
                  id={"q"}
                  register={register}
                  errors={errors}
                  fullWidth
                  placeholder={"Search Products by title, description..."}
               />
            </form>
         </div>
         <table className="table-auto" >
            <thead>
               <tr className="border bg-sky-900 text-white border-white">
                  <th className="text-center py-2">Order</th>
                  <th className="text-center py-2">Thumb</th>
                  <th className="text-center py-2">Title</th>
                  <th className="text-center py-2">Brand</th>
                  <th className="text-center py-2">Category</th>
                  <th className="text-center py-2">Price</th>
                  <th className="text-center py-2">Quantity</th>
                  <th className="text-center py-2">Sold</th>
                  <th className="text-center py-2">Color</th>
                  <th className="text-center py-2">Ratings</th>
                  <th className="text-center py-2">Updated At</th>
               </tr>
            </thead>
            <tbody>
               {products?.map((el, index) => (
                  <tr className="border-b" key={el._id}>
                     <td className="text-center py-2">{index + 1}</td>
                     <td className="text-center py-2">
                        <img src={el.thumb} alt="thumb" className="w-12 h-12 object-cover" />
                     </td>
                     <td className="text-center py-2">{el.title}</td>
                     <td className="text-center py-2">{el.brand}</td>
                     <td className="text-center py-2">{el.category}</td>
                     <td className="text-center py-2">{el.price}</td>
                     <td className="text-center py-2">{el.quantity}</td>
                     <td className="text-center py-2">{el.sold}</td>
                     <td className="text-center py-2">{el.color}</td>
                     <td className="text-center py-2">{el.averageRating}</td>
                     <td className="text-center py-2">{moment(el.updatedAt).format("DD/MM/YYYY")}</td>
                  </tr>
               ))}
            </tbody>
         </table>
         <div className="w-full flex justify-end my-8">
            <Pagination totalCount={count} />
         </div>
      </div>
   )
}

export default ManageProducts