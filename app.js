// Modules
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
let cors = require("cors");
// import all routes
const products = require("./routes/productRoute");
const order = require("./routes/orderRoute");
const auth = require("./routes/authRoute");
const payment = require("./routes/paymentRoute");
// error middleware
const errorMiddleware = require("./middleware/errors");
dotenv.config({ path: './config/config.env' })
// app initialization
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());

//routes
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/api/v1", auth);
app.use("/api/v1", products);
app.use("/api/v1", order);
app.use("/api/v1", payment);

// error middleware
app.use(errorMiddleware);

module.exports = app;
