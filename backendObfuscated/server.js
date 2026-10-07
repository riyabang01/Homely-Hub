const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

process.on('uncaughtException', (err) => {
    console.error(' UNCAUGHT EXCEPTION! Shutting down server runtime...');
    console.error(err.name, ':', err.message);
    process.exit(1);
});

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config({ path: path.join(__dirname, './config.env') });

const app = require('./app');

const DB = process.env.DATABASE_CLOUD;

console.log(' Initializing database sync connection with tracking path:', DB);

mongoose.connect(DB, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000
})
.then(() => {
    console.log(' MongoDB Database connected');
})
.catch((err) => {
    console.error(' Mongoose initial connection error:', err.message);
});

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
    console.log(` HomelyHub is running on port: ${port}`);
});

process.on('unhandledRejection', (err) => {
    console.error(' UNHANDLED REJECTION! Gracefully terminating connection tubes...');
    console.error(err.name, ':', err.message);
    server.close(() => {
        process.exit(1);
    });
});
