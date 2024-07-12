const BlogCategory = require("../models/blogCategoryModel");
const asyncHandler = require("express-async-handler");

const createCategory = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const category = await BlogCategory.findOne({ title });
    if (category) {
        throw new Error("This blog category already exists");
    } else {
        const newCategory = await BlogCategory.create(req.body);
        return res.json({
            success: newCategory ? true : false,
            createdCategory: newCategory ? newCategory : "Cannot create new blog category"
        });
    }
});

const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const { title } = req.body;
    const category = await BlogCategory.findOne({ title });
    if (category) {
        throw new Error("This blog category already exists");
    } else {
        const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true });
        return res.json({
            success: response ? true : false,
            updatedCategory: response ? response : "Cannot update blog category"
        });
    }
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    if (!bcid) {
        throw new Error("This category not exists");
    } else {
        const response = await BlogCategory.findByIdAndDelete(bcid);
        return res.json({
            success: response ? true : false,
            deletedCategory: response ? response : "Cannot delete blog category"
        });
    }
});

const getCategories = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select("title _id");
    return res.json({
        success: response ? true : false,
        blogCategories: response ? response : "Cannot get blog categories"
    });
});

module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory
}