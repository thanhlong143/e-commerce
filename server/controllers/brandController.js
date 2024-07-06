const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');

const createBrand = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const brand = await Brand.findOne({ title });
    if (brand) {
        throw new Error('This brand already exists');
    } else {
        const newBrand = await Brand.create(req.body);
        return res.json({
            success: newBrand ? true : false,
            createdBrand: newBrand ? newBrand : 'Cannot create new brand'
        });
    }
});

const getBrands = asyncHandler(async (req, res) => {
    const response = await Brand.find();
    return res.json({
        success: response ? true : false,
        brands: response ? response : 'Cannot get brands'
    });
});

const updateBrand = asyncHandler(async (req, res) => {
    const { brid } = req.params;
    const response = await Brand.findByIdAndUpdate(brid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Cannot update brand'
    });
});

const deleteBrand = asyncHandler(async (req, res) => {
    const { brid } = req.params;
    const response = await Brand.findByIdAndDelete(brid);
    return res.json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Cannot delete brand'
    });
});

module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,

}