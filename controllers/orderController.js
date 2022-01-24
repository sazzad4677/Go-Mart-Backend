const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// Create a new order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
    } = req.body
    orderItems.forEach(async (item) => {
        const product = await Product.findById(item.product)
        if (product.stock) {
            return next(new ErrorHandler("product is stock out"), 400)
        }
    });
    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id,
    })
    res.status(200).json({
        success: true,
        order
    })

})

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email username')
    if (!order) {
        return next(new ErrorHandler(' No Order Found with this id', 404))
    }
    res.status(200).json({
        success: true,
        order
    })
})

// Get login user order => /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id })
    res.status(200).json({
        success: true,
        orders
    })
})


// Get all order => /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find()
    let totalAmount = 0;
    orders.forEach(orders => { totalAmount += orders.totalPrice })
    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// update / process => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler(" Order is already delivered", 400))
    }
    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })
    order.orderStatus = req.body.status
    order.deliveredAt = Date.now()
    await order.save()
    res.status(200).json({
        success: true
    })
})

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity
    await product.save()
}

// delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email username')
    if (!order) {
        return next(new ErrorHandler(' No Order Found with this id', 404))
    }

    await order.remove()

    res.status(200).json({
        success: true,
    })
})