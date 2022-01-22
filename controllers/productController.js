const Product = require('../models/ProductModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// Create new product => /api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

// Get all products => /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        count: products.length,
        products
    })
})

// Get single Product details => /api/v1/admin/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find({productId: req.params.id});
    if (products.length === 0) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        products
    })
})


// Update single product => /api/v1/admin/update-product/:id
exports.updateSingleProduct = catchAsyncErrors(async (req, res, next) => {
    let products = await Product.exists({ productId: req.params.id });
    if (!products) {
        return next(new ErrorHandler("Product not found", 404))
    }
    products = await Product.findOneAndUpdate({ productId: req.params.id }, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        products
    })
})

// Delete single product => /api/v1/admin/delete-product/:id
exports.deleteSingleProduct = catchAsyncErrors(async (req, res, next) => {
    let products = await Product.exists({ productId: req.params.id });
    if (!products) {
        return next(new ErrorHandler("Product not found", 404))
    }
    products = await Product.deleteOne({ productId: req.params.id });
    res.status(200).json({
        success: true,
        message: 'Product is deleted'
    })
})

// Delete Multiple product => /api/v1/admin/delete-products/
exports.deleteMultiProduct = catchAsyncErrors(async (req, res, next) => {
    let products = await Product.exists(req.body);
    if (!products) {
        return next(new ErrorHandler("Product not found", 404))
    }
    products = await Product.deleteMany(req.body)
    res.status(200).json({
        success: true,
        message: 'Product is deleted',
    })
})