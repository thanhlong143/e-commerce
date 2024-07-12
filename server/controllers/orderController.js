const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { coupon } = req.body;
    const userCart = await User.findById(_id).select("cart").populate("cart.product", "title price");
    const products = userCart?.cart?.map(element => ({
        product: element.product._id,
        count: element.quantity,
        color: element.color
    }));
    let total = userCart?.cart?.reduce((sum, element) => element.product.price * element.quantity + sum, 0);
    const createData = { products, total, orderBy: _id }
    if (coupon) {
        const selectedCoupon = await Coupon.findById(coupon);
        total = Math.round(total * (1 - +selectedCoupon?.discount / 100) / 1000) * 1000 || total;
        createData.total = total;
        createData.coupon = coupon;
    }

    const result = await Order.create(createData);
    return res.json({
        success: userCart ? true : false,
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
    const { _id } = req.user;
    const response = await Order.find({ orderBy: _id });
    return res.json({
        success: response ? true : false,
        response: response ? response : "Something went wrong"
    })
});

const getOrders = asyncHandler(async (req, res) => {
    // const { _id } = req.user;
    const response = await Order.find();
    return res.json({
        success: response ? true : false,
        response: response ? response : "Something went wrong"
    })
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrders,
    getOrders

}