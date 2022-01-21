const app = require('./app');
const dotenv = require('dotenv');

// Setting up dotenv config file
dotenv.config({ path: './config/config.env' })

// Connecting to database
const connectDB = require('./config/database');
connectDB();

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})