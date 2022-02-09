const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const randomId = uuidv4().split("-").join("").slice(25, -1);
const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        unique: true,
        required: true,
        default: "GM-" + Date.now() + randomId
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
                "Food/Fruits & Vegetables/Fresh Fruits/Fresh Vegetables",
                "Food/Meat & Fish/Meat",
                "Food/Meat & Fish/Frozen Fish",
                "Food/Meat & Fish/Dried Fish",
                "Food/Meat & Fish/Tofu & Meat Alternatives",
                "Food/Cooking/Rice",
                "Food/Cooking/Premium Ingredients",
                "Food/Cooking/Colors & Flavours",
                "Food/Cooking/Pickles",
                "Food/Cooking/Spices",
                "Food/Cooking/Oil",
                "Food/Cooking/Ghee",
                "Food/Cooking/Ready Mix",
                "Food/Cooking/Salt & Sugar",
                "Food/Cooking/Dal or Lentil",
                "Food/Cooking/Special Ingredients",
                "Food/Cooking/Shemai & Suji",
                "Food/Baking/Nuts & Dried Fruits",
                "Food/Baking/Baking Tools",
                "Food/Baking/Baking & Dessert Mixes",
                "Food/Baking/Baking Ingredients",
                "Food/Baking/Flour",
                "Food/Dairy/Liquid & UHT Milk",
                "Food/Dairy/Butter & Sour Cream",
                "Food/Dairy/Cheese",
                "Food/Dairy/Eggs",
                "Food/Dairy/Powder Milk & Cream",
                "Food/Dairy/Yogurt & Sweet",
                "Food/Dairy/Yogurt & Sweet",
                "Food/Frozen & Canned/Ice Cream",
                "Food/Frozen & Canned/Frozen Snacks",
                "Food/Frozen & Canned/Canned Food",
                "Food/Bread & Bakery/Cookies",
                "Food/Bread & Bakery/Bakery Snacks",
                "Food/Bread & Bakery/Breads",
                "Food/Bread & Bakery/Dips & Spreads",
                "Food/Bread & Bakery/Honey",
                "Food/Bread & Bakery/Cakes",
                "Food/Breakfast/Local Breakfast",
                "Food/Breakfast/Energy Boosters",
                "Food/Breakfast/Cereals",
                "Food/Breakfast/Jam & Spreads",
                "Food/Snacks/Noodles",
                "Food/Snacks/Soups",
                "Food/Snacks/Pasta & Macaroni",
                "Food/Snacks/Candy & Chocolate",
                "Food/Snacks/Local Snacks",
                "Food/Snacks/Chips & Pretzels",
                "Food/Snacks/Popcorn & Nuts",
                "Food/Snacks/Salad Dressing",
                "Food/Snacks/Sauces",
                "Food/Beverages/Tea",
                "Food/Beverages/Coffee",
                "Food/Beverages/Juice",
                "Food/Beverages/Soft Drinks",
                "Food/Beverages/Water",
                "Food/Beverages/Syrups & Powder Drinks",
                "Food/Diabetic Food",
                "Hygiene",
                "Beauty & Health/Health Care",
                "Beauty & Health/Personal Care",
                "Baby Care/Newborn Essentials",
                "Baby Care/Diapers & Wipes",
                "Baby Care/Feeders",
                "Baby Care/Fooding",
                "Baby Care/Bath & Skincare",
                "Baby Care/Baby Accessories",
                "Baby Care/Baby Oral Care",
                "Pet Care/Kitten Food",
                "Pet Care/Cat Food",
                "Pet Care/Dog Food",
                "Pet Care/Other Pet Foods",
                "Pet Care/Pet Accessories",
                "Cleaning Supplies/Air Fresheners",
                "Cleaning Supplies/Dishwashing Supplies",
                "Cleaning Supplies/Toilet & Surface Cleaners",
                "Cleaning Supplies/Laundry",
                "Cleaning Supplies/Napkins & Paper Products",
                "Cleaning Supplies/Pest Control",
                "Cleaning Supplies/Shoe Care",
                "Cleaning Supplies/Tableware & Trash Bags",
                "Cleaning Supplies/Cleaning Accessories",
                "Home & Kitchen/Gardening",
                "Home & Kitchen/Kitchen Accessories",
                "Home & Kitchen/Lights & Electrical",
                "Home & Kitchen/Tools & Hardware",
                "Home & Kitchen/Kitchen Appliances",
                "Stationery & Office/Batteries",
                "Stationery & Office/Writing & Drawing",
                "Stationery & Office/Organizers",
                "Stationery & Office/Printing",
                "Toys & Fun/Cars & Toy Vehicles",
                "Toys & Fun/Dolls & Action Figures",
                "Toys & Fun/Plush & Stuffed Animals",
                "Toys & Fun/Cars & Toy Vehicles",
                "Toys & Fun/Learning Toys",
                "Sports & Fitness/Cricket",
                "Sports & Fitness/Badminton",
                "Sports & Fitness/Football",
                "Sports & Fitness/Other Sports",
                "Vehicle Essentials"
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
            user: {
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
    user: {
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