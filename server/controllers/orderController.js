const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const { products, total, address, status } = req.body;
   if (address) {
      await User.findByIdAndUpdate(_id, { address, cart: [] })
   }

   const data = { products, total, orderBy: _id }
   if (status) data.status = status;
   const result = await Order.create(data);
   return res.json({
      success: result ? true : false,
      result: result ? result : "Cannot create new order"
   })
});

const updateStatus = asyncHandler(async (req, res) => {
   const { oid } = req.params;
   const { status } = req.body;
   if (!status) {
      throw new Error("Missing status");
   }
   const response = await Order.findByIdAndUpdate(oid, { status }, { new: true });
   return res.json({
      success: response ? true : false,
      response: response ? response : "Something went wrong"
   })
});

const getUserOrders = asyncHandler(async (req, res) => {
   const queries = { ...req.query };
   const { _id } = req.user;
   const excludeFields = ["limit", "sort", "page", "fields"];
   excludeFields.forEach(element => delete queries[element]);
   let queryString = JSON.stringify(queries);
   queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedElement => `$${matchedElement}`);
   const formatedQueries = JSON.parse(queryString);

   const qr = { ...formatedQueries, orderBy: _id };

   let sortBy = {};
   if (req.query.sort) { sortBy = req.query.sort.split(",").join(" "); }

   let fields = {};
   if (req.query.fields) { fields = req.query.fields.split(",").join(" "); }

   const page = +req.query.page || 1
   const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
   const skip = (page - 1) * limit;

   await Order.find(qr).skip(skip).limit(limit).select(fields).sort(sortBy)
      .then(async (response) => {
         const count = await Order.find(qr).countDocuments();
         return res.status(200).json({
            success: response ? true : false,
            count,
            orders: response ? response : "Cannot get orders",
         });
      })
      .catch((error) => { return error; })
});

const getOrders = asyncHandler(async (req, res) => {
   const queries = { ...req.query };
   const excludeFields = ["limit", "sort", "page", "fields"];
   excludeFields.forEach(element => delete queries[element]);
   let queryString = JSON.stringify(queries);
   queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedElement => `$${matchedElement}`);
   const formatedQueries = JSON.parse(queryString);

   const qr = { ...formatedQueries };

   let sortBy = {};
   if (req.query.sort) { sortBy = req.query.sort.split(",").join(" "); }

   let fields = {};
   if (req.query.fields) { fields = req.query.fields.split(",").join(" "); }

   const page = +req.query.page || 1
   const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
   const skip = (page - 1) * limit;

   await Order.find(qr).skip(skip).limit(limit).select(fields).sort(sortBy)
      .then(async (response) => {
         const count = await Order.find(qr).countDocuments();
         return res.status(200).json({
            success: response ? true : false,
            count,
            orders: response ? response : "Cannot get orders",
         });
      })
      .catch((error) => { return error; })
});

module.exports = {
   createOrder,
   updateStatus,
   getUserOrders,
   getOrders
}