const Product = require('../models/ProductModel')

// Create new product => /api/v1/product/new
exports.newProduct = async (req, res, next) => {
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
}

// Get all products => /api/v1/products
exports.getProducts = async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        count: products.length,
        products
    })
}

// Get single Product details => /api/v1/admin/product/:id
exports.getSingleProduct = async (req, res, next) => {
    const products = await Product.find({productId: req.params.id});
    if (!products) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({
        success: true,
        products
    })
}