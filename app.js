// Modules
const express = require('express');
const cookieParser = require('cookie-parser')
// import all routes
const products = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const auth = require('./routes/authRoute')
// error middleware
const errorMiddleware = require('./middleware/errors')

// app initialization
const app = express();
app.use(express.json());
app.use(cookieParser())

//routes
app.use('/api/v1', auth);
app.use('/api/v1', products)
app.use('/api/v1', order)

// error middleware
app.use(errorMiddleware)

module.exports = app;