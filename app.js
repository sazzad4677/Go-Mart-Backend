// Modules
const express = require('express');
// import all routes
const products = require('./routes/productRoute');
// error middleware
const errorMiddleware = require('./middleware/errors')

// app initialization
const app = express();
app.use(express.json());

//routes
app.use('/api/v1', products)

// error middleware
app.use(errorMiddleware)

module.exports = app;