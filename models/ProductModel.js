const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        unique: true,
        required: true,
        default: Date.now(),
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
    createdAt: {
        type: String,
        default: `${new Date().toDateString()} Time ${((new Date().getHours() % 12) || 12)}:${new Date().getMinutes()} ${((new Date().getHours() >= 12 ? 'pm' : 'am'))}`
    }
})



productSchema.pre('save', function (next) {
    this.productId = "GM-" + Date.now()+uuidv4().split("-").join("").slice(25,-1);
    next()
})

module.exports = mongoose.model('Product', productSchema);