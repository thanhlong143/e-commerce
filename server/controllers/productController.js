const { response } = require('express');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createProduct = asyncHandler(async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing inputs');
    }
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const newProduct = await Product.create(req.body);
    return res.status(200).json({
        success: newProduct ? true : false,
        createdProduct: newProduct ? newProduct : 'Cannot create new product'
    });
});

const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid);
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Cannot get product'
    });
});

// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(element => delete queries[element]);
    // Format lại các operators cho đúng cú pháp mongose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedElement => `$${matchedElement}`);
    const formatedQueries = JSON.parse(queryString);
    
    // Filtering
    if (queries?.title) {
        formatedQueries.title = { $regex: queries.title, $options: 'i' }
    }

    // Sorting
    let sortBy = {};
    if (req.query.sort) {
        sortBy = req.query.sort.split(',').join(' ');
    }

    // Fields limiting
    let fields = {};
    if (req.query.fields) {
        fields = req.query.fields.split(',').join(' ');
    }

    // pagination
    const page = +req.query.page || 1
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;

    await Product.find(formatedQueries).skip(skip).limit(limit).select(fields).sort(sortBy)
    .then(async (response) => {
        const count = await Product.find(formatedQueries).countDocuments();
        return res.status(200).json({
            success: response ? true : false,
            count,
            products: response ? response : 'Cannot get products',
        });
    })
    .catch((error) => {
        return error;
    })
    
});

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        updatedProduct: updatedProduct ? updatedProduct : 'Cannot update product'
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const deletedProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deletedProduct ? true : false,
        deletedProduct: deletedProduct ? deletedProduct : 'Cannot delete product'
    });
});

const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid } = req.body;
    if (!star || !pid) {
        throw new Error('Missing inputs');
    }
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(element => element.postedBy.toString() === _id);
    if (alreadyRating) {
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment }
        }, { new: true });
    } else {
        await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id } }
        }, { new: true });
    }

    // Sum ratings
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce((sum, element) => sum + +element.star, 0);
    updatedProduct.averageRating = Math.round(sumRatings * 10 / ratingCount) / 10;

    await updatedProduct.save();

    return res.status(200).json({
        success: true,
        updatedProduct
    })
});

module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    ratings,

}