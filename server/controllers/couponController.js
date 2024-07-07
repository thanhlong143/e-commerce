const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');

const createCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry) {
        throw new Error('Missing Inputs');
    }
    const coupon = await Coupon.findOne({ name });
    if (coupon) {
        throw new Error('This coupon already exists');
    } else {
        const newCoupon = await Coupon.create({
            ...req.body,
            expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000
        });
        return res.json({
            success: newCoupon ? true : false,
            createdCoupon: newCoupon ? newCoupon : 'Cannot create new coupon'
        });
    }
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (!Object.keys(req.body).length === 0) {
        throw new Error('Missing Inputs');
    }
    if (req.body.expiry) {
        req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
    }
    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Cannot update new coupon'
    });
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const response = await Coupon.findByIdAndDelete(cid);
    return res.json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Cannot delete coupon'
    });
});

const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select('-createdAt -updatedAt');
    return res.json({
        success: response ? true : false,
        coupons: response ? response : 'Cannot get coupon'
    });
});

module.exports = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getCoupons,

}