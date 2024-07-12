const Blog = require("../models/blogModel");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
        throw new Error("Missing Inputs");
    }
    const blog = await Blog.findOne({ title });
    if (blog) {
        throw new Error("This blog already exists");
    } else {
        const newBlog = await Blog.create(req.body);
        return res.json({
            success: newBlog ? true : false,
            createdBlog: newBlog ? newBlog : "Cannot create new blog"
        });
    }
});

const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!Object.keys(req.body).length === 0) {
        throw new Error("Missing Inputs");
    }
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        updatedBlog: response ? response : "Cannot update new blog"
    });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Blog.findByIdAndDelete(bid);
    return res.json({
        success: response ? true : false,
        deletedBlog: response ? response : "Cannot delete blog"
    });
});

const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find();
    return res.json({
        success: response ? true : false,
        blogs: response ? response : "Cannot get blog"
    });
});

/**
 * Khi người dùng like một blog thì:
 * 1. Check xem người đó trước đó có dislike hay không => bỏ dislike
 * 2. Check xem người đó trước đó có like hay không => bỏ like / Thêm like
 */

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) {
        throw new Error("Missing inputs");
    }
    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog?.dislikes?.find(element => element.toString() === _id);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            result: response
        })
    }
    const isLiked = blog?.likes?.find(element => element.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            result: response
        });
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            result: response
        });
    }
});

const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) {
        throw new Error("Missing inputs");
    }
    const blog = await Blog.findById(bid);
    const alreadyLiked = blog?.likes?.find(element => element.toString() === _id);
    if (alreadyLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            result: response
        })
    }
    const isDisliked = blog?.dislikes?.find(element => element.toString() === _id);
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            result: response
        });
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            result: response
        });
    }
});

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate("likes", "firstname lastname")
        .populate("dislikes", "firstname lastname");
    return res.json({
        success: blog ? true : false,
        result: blog
    })
});

const uploadBlogImages = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!req.file) {
        throw new Error("Missing Inputs")
    }
    const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true });

    return res.status(200).json({
        success: response ? true : false,
        updatedBlog: response ? response : "Cannot upload blog image"
    });
})

module.exports = {
    createBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog,
    uploadBlogImages
}