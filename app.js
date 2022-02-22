// Modules
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
// import all routes
const products = require("./routes/productRoute");
const order = require("./routes/orderRoute");
const auth = require("./routes/authRoute");
// error middleware
const errorMiddleware = require("./middleware/errors");
dotenv.config({ path: "./config/config.env" });
// app initialization
const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

//routes
app.get(
  "/",
  res.send({
    message: "hello",
  })
);
app.use("/api/v1", auth);
app.use("/api/v1", products);
app.use("/api/v1", order);

// error middleware
app.use(errorMiddleware);

module.exports = app;
