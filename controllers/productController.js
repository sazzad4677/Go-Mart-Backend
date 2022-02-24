const Product = require("../models/ProductModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const SearchFilterAndPagination = require("../utils/SearchFilterAndPagination");
const Filter = require("bad-words");
filter = new Filter();

// Create new product => /api/v1/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.createdBy = req.user.username;
  req.body.role = req.user.role;
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products => /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  // for pagination total number of products
  const resultPerPage = req.query.size;
  // total product in the database
  const totalProductsCount = await Product.countDocuments();
  const apiFeatures = new SearchFilterAndPagination(Product.find(), req.query)
    .search()
    .sorting(req.query.sorting)
    .filter();
  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;
  apiFeatures.pagination(resultPerPage);
  products = await apiFeatures.query.clone();
  res.status(200).json({
    success: true,
    totalProductsCount,
    products,
    filteredProductsCount,
  });
});

// Get single Product details => /api/v1/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.findById(req.params.id);
  if (!products) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    products,
  });
});

// Update single product => /api/v1/admin/update-product/:id
exports.updateSingleProduct = catchAsyncErrors(async (req, res, next) => {
  let products = await Product.exists({ productId: req.params.id });
  if (!products) {
    return next(new ErrorHandler("Product not found", 404));
  }
  products = await Product.findOneAndUpdate(
    { productId: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    products,
  });
});

// Delete single product => /api/v1/admin/delete-product/:id
exports.deleteSingleProduct = catchAsyncErrors(async (req, res, next) => {
  let products = await Product.exists({ productId: req.params.id });
  if (!products) {
    return next(new ErrorHandler("Product not found", 404));
  }
  products = await Product.deleteOne({ productId: req.params.id });
  res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});

// Delete Multiple product => /api/v1/admin/delete-products/
exports.deleteMultiProduct = catchAsyncErrors(async (req, res, next) => {
  let products = await Product.exists(req.body);
  if (!products) {
    return next(new ErrorHandler("Product not found", 404));
  }
  products = await Product.deleteMany(req.body);
  res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});

// Delete all product => /api/v1/admin/delete-all-products/
exports.deleteAllProduct = catchAsyncErrors(async (req, res, next) => {
  let products = await Product.find();
  if (products.length === 0) {
    return next(new ErrorHandler("Product not found", 404));
  }
  await Product.deleteMany();
  res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});

// create new review => api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment: filter.clean(comment),
  };
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const isReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = filter.clean(comment);
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;

  await product.save();

  res.status(200).json({
    success: true,
  });
});

// get product reviews => /api/v1/reviews?productId=GM-.....
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.find({ productId: req.query.productId });
  if (!product.length) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product[0].reviews,
  });
});

// delete product reviews => /api/v1/reviews?productId=_id&id=review-_id
exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  const numberOfReviews = reviews.length;
  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numberOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
