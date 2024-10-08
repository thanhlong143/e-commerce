import { apiUpdateProduct } from "apis";
import { Button, InputForm, Loading, MarkdownEditor, Select } from "components"
import React, { memo, useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { showModal } from "store/app/appSlice";
import { getBase64, validate } from "utils/helpers";

const UpdateProduct = ({ editProduct, render, setEditProduct }) => {
   const { categories } = useSelector(state => state.app);
   const dispatch = useDispatch();
   const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
   const [payload, setPayload] = useState({
      description: ""
   });

   const [preview, setPreview] = useState({
      thumbnail: null,
      images: []
   });

   useEffect(() => {
      reset({
         title: editProduct?.title || "",
         price: editProduct?.price || "",
         quantity: editProduct?.quantity || "",
         color: editProduct?.color || "",
         category: editProduct?.category || "",
         brand: editProduct?.brand?.toLowerCase() || "",
      });
      setPayload({ description: typeof editProduct?.description === "object" ? editProduct?.description?.join(", ") : editProduct?.description })
      setPreview({
         thumbnail: editProduct?.thumbnail || "",
         images: editProduct?.images || []
      })
   }, [editProduct])

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

   const handleUpdateProduct = async (data) => {
      const invalid = validate(payload, setInvalidFields)
      if (invalid === 0) {
         if (data.category) { data.category = categories?.find(el => el.title === data.category)?.title }
         const finalPayload = { ...data, ...payload }
         finalPayload.thumbnail = data?.thumbnail?.length === 0 ? preview.thumbnail : data.thumbnail[0];
         const formData = new FormData();
         for (let i of Object.entries(finalPayload)) { formData.append(i[0], i[1]); }
         finalPayload.images = data.images?.length === 0 ? preview.images : data.images;
         for (let image of finalPayload.images) { formData.append("images", image); }
         dispatch(showModal({ isShowModal: true, modalChildren: <Loading /> }))
         const response = await apiUpdateProduct(formData, editProduct._id);
         dispatch(showModal({ isShowModal: false, modalChildren: null }))
         if (response.success) {
            toast.success(response.message);
            render()
            setEditProduct(null)
         } else { toast.error(response.message); }
      }
   }

   return (
      <div className="w-full flex flex-col gap-4 relative">
         <div className="h-[69px] w-full"></div>
         <div className="p-4 border-b bg-gray-100 flex justify-between items-center right-0 left-[327px] fixed top-0">
            <h1 className="text-3xl font-bold tracking-tight">Update Products</h1>
            <span className="text-main hover:underline cursor-pointer" onClick={() => { setEditProduct(null) }}>Cancel</span>
         </div>
         <div className="p-4">
            <form onSubmit={handleSubmit(handleUpdateProduct)}>
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
                     option={categories?.map(el => ({ code: el.title, value: el.title }))}
                     register={register}
                     id={"category"}
                     validate={{ required: "Vui lòng chọn" }}
                     style={"flex-auto"}
                     errors={errors}
                     fullWidth
                  />
                  <Select
                     label={"Brand (Optional)"}
                     option={categories?.find(el => el.title === watch("category"))?.brand?.map(el => ({ code: el?.toLowerCase(), value: el }))}
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
                  value={payload.description}
               />
               <div className="flex flex-col gap-2 mt-8">
                  <label className="font-semibold" htmlFor="thumbnail">Upload thumbnail</label>
                  <input
                     type="file"
                     id="thumbnail"
                     {...register("thumbnail")}
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
                     {...register("images")}
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
                  <Button type="submit">Update New Product</Button>
               </div>
            </form>
         </div>
      </div>
   )
}

export default memo(UpdateProduct)