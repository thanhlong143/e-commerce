import { apiAddVariant } from "apis";
import Button from "../buttons/Button";
import Loading from "../common/Loading";
import InputForm from "components/inputs/InputForm";
import React, { memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import Swal from "sweetalert2";
import { getBase64 } from "utils/helpers";

const CustomizeVariants = ({ customizeVariant, setCustomizeVariant, render }) => {

   const dispatch = useDispatch();
   const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
   const [preview, setPreview] = useState({
      thumbnail: null,
      images: []
   });

   useEffect(() => {
      reset({
         title: customizeVariant?.title,
         price: customizeVariant?.price,
         color: customizeVariant?.color,
      })
   }, [customizeVariant]);

   const handlePreviewThumb = async (file) => {
      const base64Thumb = await getBase64(file);
      setPreview(prev => ({ ...prev, thumbnail: base64Thumb }))
   }

   const handlePreviewImages = async (files) => {
      const imagesPreview = [];
      for (let file of files) {
         if (file.type !== "image/png" && file.type !== "image/jpeg") {
            toast.warning("File is not supported")
            return;
         }
         const base64 = await getBase64(file);
         imagesPreview.push(base64);

      }
      setPreview(prev => ({ ...prev, images: imagesPreview }));
   }

   const handleAddVariant = async (data) => {
      if (data.color === customizeVariant.color) { Swal.fire("Oops!", "Color is not changed", "info") }
      else {
         const formData = new FormData();
         for (let i of Object.entries(data)) { formData.append(i[0], i[1]); }
         if (data.thumbnail) { formData.append("thumbnail", data.thumbnail[0]) }
         if (data.images) {
            for (let image of data.images) {
               formData.append("images", image)
            }
         }
         dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
         const response = await apiAddVariant(formData, customizeVariant._id);
         dispatch(showModal({ isShowModal: false, modalChildren: null }));
         if (response.success) {
            toast.success(response.message);
            reset();
            setPreview({ thumbnail: "", images: [] })
         } else { toast.error(response.message); }
      }
   }

   useEffect(() => {
      if (watch("thumbnail") instanceof FileList && watch("thumbnail").length > 0) {
         handlePreviewThumb(watch("thumbnail")[0]);
      }
   }, [watch("thumbnail")]);

   useEffect(() => {
      if (watch("images") instanceof FileList && watch("images").length > 0) {
         handlePreviewImages(watch("images"));
      }
   }, [watch("images")]);

   return (
      <div className="w-full flex flex-col gap-4 relative">
         <div className="h-[69px] w-full"></div>
         <div className="p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[327px] fixed top-0">
            <h1 className="text-3xl font-bold tracking-tight">Customize Variants of Products</h1>
            <span
               className="text-main hover:underline cursor-pointer"
               onClick={() => { setCustomizeVariant(null) }}
            >
               Cancel
            </span>
         </div>
         <form onSubmit={handleSubmit(handleAddVariant)} className="p-4 w-full flex flex-col gap-4">
            <div className="flex gap-4 items-center w-full">
               <InputForm
                  label={"Name product"}
                  register={register}
                  errors={errors}
                  id={"title"}
                  validate={{
                     required: "Need fill this field"
                  }}
                  placeholder={"Title of variant"}
                  style={"flex-auto"}
               />
            </div>
            <div className="flex gap-4 items-center w-full">
               <InputForm
                  label={"Price variant"}
                  register={register}
                  errors={errors}
                  id={"price"}
                  validate={{
                     required: "Need fill this field"
                  }}
                  placeholder={"Price of new variant"}
                  fullWidth
                  style={"flex-auto"}
                  type="number"
               />
               <InputForm
                  label={"Color variant"}
                  register={register}
                  errors={errors}
                  id={"color"}
                  validate={{
                     required: "Need fill this field"
                  }}
                  fullWidth
                  style={"flex-auto"}
                  placeholder={"Color of new variant"}
               />
            </div>
            <div className="flex flex-col gap-2 mt-8">
               <label className="font-semibold" htmlFor="thumbnail">Upload thumbnail</label>
               <input
                  type="file"
                  id="thumbnail"
                  {...register("thumbnail", { required: "Vui lòng chọn ảnh" })}
               />
               {errors["thumbnail"] && <small className="text-xs text-red-500">{errors["thumbnail"]?.message}</small>}
            </div>
            {preview.thumbnail && <div className="my-4">
               <img src={preview.thumbnail} alt="thumbnail" className="w-[200px] object-contain" />
            </div>}
            <div className="flex flex-col gap-2 mt-8">
               <label className="font-semibold" htmlFor="products">Upload images of product</label>
               <input
                  type="file"
                  id="products"
                  multiple
                  {...register("images", { required: "Vui lòng chọn ảnh" })}
               />
               {errors["images"] && <small className="text-xs text-red-500">{errors["images"]?.message}</small>}
            </div>
            {preview.images.length > 0 && <div className="my-4 flex w-full gap-3 flex-wrap">
               {preview.images?.map((el, index) => (
                  <div
                     key={index}
                     className="w-fit relative"
                  >
                     <img src={el} alt="products" className="w-[200px] object-contain" />
                  </div>
               ))}
            </div>}
            <div className="my-6">
               <Button type="submit">Add Variants</Button>
            </div>
         </form>
      </div>
   )
}

export default memo(CustomizeVariants)