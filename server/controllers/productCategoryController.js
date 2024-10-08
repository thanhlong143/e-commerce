const ProductCategory = require("../models/productCategoryModel");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
   const { title } = req.body;
   const category = await ProductCategory.findOne({ title });
   if (category) {
      throw new Error("This category already exists");
   } else {
      const newCategory = await ProductCategory.create(req.body);
      return res.json({
         success: newCategory ? true : false,
         createdCategory: newCategory ? newCategory : "Cannot create new product category"
      });
   }
});

const getCategories = asyncHandler(async (req, res) => {
   const response = await ProductCategory.find();
   return res.json({
      success: response ? true : false,
      productCategories: response ? response : "Cannot get product categories"
   });
});

const updateCategory = asyncHandler(async (req, res) => {
   const { pcid } = req.params;
   const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true });
   return res.json({
      success: response ? true : false,
      updatedCategory: response ? response : "Cannot update product category"
   });
});

const deleteCategory = asyncHandler(async (req, res) => {
   const { pcid } = req.params;
   const response = await ProductCategory.findByIdAndDelete(pcid);
   return res.json({
      success: response ? true : false,
      deletedCategory: response ? response : "Cannot delete product category"
   });
});

module.exports = {
   createCategory,
   getCategories,
   updateCategory,
   deleteCategory,

}