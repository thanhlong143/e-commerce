const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const data = require("../../data/ecommerce.json");
const slugify = require("slugify");
const categoryData = require("../../data/category_brand");
const ProductCategory = require("../models/productCategoryModel");

const fn = async (product) => {
   await Product.create({
      title: product?.name,
      slug: slugify(product?.name) + Math.round(Math.random() * 1000) + "",
      description: product?.description,
      brand: product?.brand,
      thumb: product?.thumb,
      price: Math.round(Number(product?.price?.match(/\d/g).join("")) / 100),
      category: product?.category[1],
      quantity: Math.round(Math.random() * 1000),
      sold: Math.round(Math.random() * 100),
      images: product?.images,
      color: product?.variants.find(el => el.label === "Color")?.variants[0],
      averageRating: Math.round(Math.random() * 5)
   })
}

const insertProduct = asyncHandler(async (req, res) => {
   const promises = [];
   for (let product of data) {
      promises.push(fn(product));
   }
   await Promise.all(promises);
   return res.json("Done");
});

const fn2 = async (category) => {
   await ProductCategory.create({
      title: category?.category,
      brand: category?.brand
   });
}

const insertCategory = asyncHandler(async (req, res) => {
   const promises = [];
   for (let category of categoryData) {
      promises.push(fn2(category));
   }
   await Promise.all(promises);
   return res.json("Done");
});

module.exports = {
   insertProduct,
   insertCategory
}