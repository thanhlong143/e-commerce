const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const makeSku = require("uniqid");

const createProduct = asyncHandler(async (req, res) => {
	const { title, price, description, brand, category, color } = req.body;
	const thumbnail = req.files?.thumbnail[0]?.path;
	const images = req.files?.images?.map(el => el.path);

	if (!(title && price && description && brand && category && color)) {
		throw new Error("Missing inputs");
	}
	req.body.slug = slugify(title);
	if (thumbnail) { req.body.thumbnail = thumbnail }
	if (images) { req.body.images = images }
	const newProduct = await Product.create(req.body);
	return res.status(200).json({
		success: newProduct ? true : false,
		message: newProduct ? "Created" : "Failed"
	});
});

const getProduct = asyncHandler(async (req, res) => {
	const { pid } = req.params;
	const product = await Product.findById(pid).populate({
		path: "ratings",
		populate: {
			path: "postedBy",
			select: "firstname lastname avatar"
		}
	});
	return res.status(200).json({
		success: product ? true : false,
		productData: product ? product : "Cannot get product"
	});
});

// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
	const queries = { ...req.query };
	const excludeFields = ["limit", "sort", "page", "fields"];
	excludeFields.forEach(element => delete queries[element]);
	let queryString = JSON.stringify(queries);
	queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedElement => `$${matchedElement}`);
	const formatedQueries = JSON.parse(queryString);
	let colorQueryObject = {}

	if (queries?.title) { formatedQueries.title = { $regex: queries.title, $options: "i" } }
	if (queries?.category) { formatedQueries.category = { $regex: queries.category, $options: "i" } }
	if (queries?.brand) { formatedQueries.brand = { $regex: queries.brand, $options: "i" } }
	if (queries?.color) {
		delete formatedQueries.color;
		const colorArr = queries.color.split(",");
		const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: "i" } }));
		colorQueryObject = { $or: colorQuery }
	}

	let queryObject = {}
	if (queries?.q) {
		delete formatedQueries.q;
		queryObject = {
			$or: [
				{ color: { $regex: queries.q, $options: "i" } },
				{ title: { $regex: queries.q, $options: "i" } },
				{ category: { $regex: queries.q, $options: "i" } },
				{ brand: { $regex: queries.q, $options: "i" } },
				// { description: { $regex: queries.q, $options: "i" } },
			]
		}
	}
	
	const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject };

	let sortBy = {};
	if (req.query.sort) { sortBy = req.query.sort.split(",").join(" "); }

	let fields = {};
	if (req.query.fields) { fields = req.query.fields.split(",").join(" "); }

	const page = +req.query.page || 1
	const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
	const skip = (page - 1) * limit;

	await Product.find(qr).skip(skip).limit(limit).select(fields).sort(sortBy)
		.then(async (response) => {
			const count = await Product.find(qr).countDocuments();
			return res.status(200).json({
				success: response ? true : false,
				count,
				products: response ? response : "Cannot get products",
			});
		})
		.catch((error) => { return error; })

});

const updateProduct = asyncHandler(async (req, res) => {
	const { pid } = req.params;
	const files = req?.files;
	if (files?.thumbnail) { req.body.thumbnail = files?.thumbnail[0]?.path; }
	if (files?.images) { req.body.images = files?.images?.map(el => el.path); }
	if (req.body && req.body.title) { req.body.slug = slugify(req.body.title); }
	const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
	return res.status(200).json({
		success: updatedProduct ? true : false,
		message: updatedProduct ? "Updated" : "Cannot update product"
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
		message: deletedProduct ? "Deleted" : "Cannot delete product"
	});
});

const ratings = asyncHandler(async (req, res) => {
	const { _id } = req.user;
	const { star, comment, pid, updatedAt } = req.body;
	if (!star || !pid) {
		throw new Error("Missing inputs");
	}
	const ratingProduct = await Product.findById(pid);
	const alreadyRating = ratingProduct?.ratings?.find(element => element.postedBy.toString() === _id);
	if (alreadyRating) {
		await Product.updateOne({
			ratings: { $elemMatch: alreadyRating }
		}, {
			$set: { "ratings.$.star": star, "ratings.$.comment": comment, "ratings.$.updatedAt": updatedAt }
		}, { new: true });
	} else {
		await Product.findByIdAndUpdate(pid, {
			$push: { ratings: { star, comment, postedBy: _id, updatedAt: updatedAt } }
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

const uploadProductImages = asyncHandler(async (req, res) => {
	const { pid } = req.params;
	if (!req.files) { throw new Error("Missing Inputs"); }
	const response = await Product.findByIdAndUpdate(
		pid,
		{ $push: { images: { $each: req.files.map(element => element.path) } } },
		{ new: true }
	);

	return res.status(200).json({
		success: response ? true : false,
		updatedProduct: response ? response : "Cannot upload product images"
	});
});

const addVariant = asyncHandler(async (req, res) => {
	const { pid } = req.params;
	const { title, price, color } = req.body;
	const thumbnail = req.files?.thumbnail[0]?.path;
	const images = req.files?.images?.map(el => el.path);

	if (!(title && price && color)) { throw new Error("Missing inputs"); }
	const response = await Product.findByIdAndUpdate(
		pid,
		{ $push: { variants: { color,price,title,thumbnail,images,sku:makeSku().toUpperCase() } } },
		{ new: true }
	);

	return res.status(200).json({
		success: response ? true : false,
		message: response ? "Added variant" : "Cannot upload product images"
	});
});

module.exports = {
	createProduct,
	getProduct,
	getProducts,
	updateProduct,
	deleteProduct,
	ratings,
	uploadProductImages,
	addVariant,

}