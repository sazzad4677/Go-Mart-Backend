// Modules
const express = require('express');
// import all routes
const products = require('./routes/productRoute');

// app initialization
const app = express();
app.use(express.json());

//routes
app.use('/api/v1', products)

module.exports = app;