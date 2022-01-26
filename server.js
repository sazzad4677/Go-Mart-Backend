const app = require('./app');
const connectDB = require('./config/database');
const dotenv = require('dotenv');

// handle uncaught exceptions
process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`);
    console.log(`Error Stack: ${err.stack}`);
    console.log(`Shutting down server due to uncaught exceptions`);
    process.exit(1);
})

// Setting up config file
dotenv.config({ path: './config/config.env' })


// Connecting to database
connectDB();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})

// handle unhandled promise rejection
process.on('unhandledRejection', err => {
    console.log(`Error : ${err.message}`);
    console.log(`Shutting down server due to unhandled promise rejection`);
    server.close(() => {
        process.exit(1);
    });
})