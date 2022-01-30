const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const randomId = uuidv4().split("-").join("").slice(25,-1);
const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        unique: true,
        required: true,
        default: "GM-" + Date.now()+randomId
    },
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product cannot be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select product category'],
        enum: {
            values: [
                'Electronics',
                'Cameras',
                'Laptop'
            ],
            message: 'Please select correct category of this product'
        }
    },
    seller: {
        type: String,
        required: [true, 'Please select product seller'],
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                type: mongoose.Schema.ObjectId,
                ref: 'User', 
                required: true,
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: true,
    },
    createdBy: {
        type: String,
        ref: 'User',
        required: true,
    },
    role: {
        type: String,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: String,
        default: `${new Date().toDateString()} Time ${((new Date().getHours() % 12) || 12)}:${new Date().getMinutes()} ${((new Date().getHours() >= 12 ? 'pm' : 'am'))}`
    }
})

module.exports = mongoose.model('Product', productSchema);