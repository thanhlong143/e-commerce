import { apiCreateProduct } from "apis";
import { Button, InputForm, Loading, MarkdownEditor, Select } from "components";
import React, { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import { getBase64, validate } from "utils/helpers";

const CreateProducts = () => {
   const { categories } = useSelector(state => state.app);
   const dispatch = useDispatch();
   const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();
   const [payload, setPayload] = useState({
      description: ""
   });
   const [preview, setPreview] = useState({
      thumbnail: null,
      images: []
   });
   const [invalidFields, setInvalidFields] = useState([]);
   const changeValue = useCallback((e) => {
      setPayload(e);
   }, [payload]);
   
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

   // useEffect(() => {
   //    if (watch("thumbnail")) { handlePreviewThumb(watch("thumbnail")[0]); }
   // }, [watch("thumbnail")]);

   // useEffect(() => {
   //    if (watch("images")) { handlePreviewImages(watch("images")); }
   // }, [watch("images")]);

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

   const handleCreateProduct = async (data) => {
      const invalid = validate(payload, setInvalidFields)
      if (invalid === 0) {
         if (data.category) { data.category = categories?.find(el => el._id === data.category)?.title }
         const finalPayload = { ...data, ...payload }
         const formData = new FormData();
         for (let i of Object.entries(finalPayload)) { formData.append(i[0], i[1]); }
         if (finalPayload.thumbnail) { formData.append("thumbnail", finalPayload.thumbnail[0]) }
         if (finalPayload.images) {
            for (let image of finalPayload.images) {
               formData.append("images", image)
            }
         }
         dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
         const response = await apiCreateProduct(formData);
         dispatch(showModal({ isShowModal: false, modalChildren: null }))
         if (response.success) {
            toast.success(response.message);
            reset();
            setPayload({
               thumbnail: "",
               image: []
            })
         } else { toast.error(response.message); }
      }
   }

   return (
      <div className="w-full">
         <h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
            <span>Create p</span>
         </h1>
         <div className="p-4">
            <form onSubmit={handleSubmit(handleCreateProduct)}>
               <InputForm
                  label={"Name product"}
                  register={register}
                  errors={errors}
                  id={"title"}
                  validate={{
                     required: "Need fill this field"
                  }}
                  fullWidth
                  placeholder={"Name of new products"}
               />
               <div className="w-full my-6 flex gap-4">
                  <InputForm
                     label={"Price"}
                     register={register}
                     errors={errors}
                     id={"price"}
                     validate={{
                        required: "Need fill this field"
                     }}
                     style={"flex-auto"}
                     placeholder={"Price of new product"}
                     type="number"
                  />
                  <InputForm
                     label={"Quantity"}
                     register={register}
                     errors={errors}
                     id={"quantity"}
                     validate={{
                        required: "Need fill this field"
                     }}
                     style={"flex-auto"}
                     placeholder={"Quantity of new product"}
                     type="number"
                  />
                  <InputForm
                     label={"Color"}
                     register={register}
                     errors={errors}
                     id={"color"}
                     validate={{
                        required: "Need fill this field"
                     }}
                     style={"flex-auto"}
                     placeholder={"Color of new product"}
                  />
               </div>
               <div className="w-full my-6 flex gap-4">
                  <Select
                     label={"Category"}
                     option={categories?.map(el => ({ code: el._id, value: el.title }))}
                     register={register}
                     id={"category"}
                     validate={{ required: "Vui lòng chọn" }}
                     style={"flex-auto"}
                     errors={errors}
                     fullWidth
                  />
                  <Select
                     label={"Brand (Optional)"}
                     option={categories?.find(el => el._id === watch("category"))?.brand?.map(el => ({ code: el, value: el }))}
                     register={register}
                     id={"brand"}
                     style={"flex-auto"}
                     errors={errors}
                     fullWidth
                  />
               </div>
               <MarkdownEditor
                  name={"description"}
                  changeValue={changeValue}
                  label={"Description"}
                  invalidFields={invalidFields}
                  setInvalidFields={setInvalidFields}
               />
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
                  <Button type="submit">Create New Product</Button>
               </div>
            </form>
         </div>
      </div>
   )
}

export default CreateProducts