const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, './config.env') });
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = require('./app');
const DB = process.env.DATABASE_CLOUD;

let isConnected = false;
const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(DB, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        isConnected = true;
        console.log('MongoDB Database connected');
    } catch (err) {
        console.error('Mongoose connection error:', err.message);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

const port = process.env.PORT || 8000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`HomelyHub is running locally on port: ${port}`);
    });
} else {
    app.listen(port);
}

module.exports = app;
