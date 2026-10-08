const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.join(__dirname, './config.env') });
    dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const app = require('./app');
const DB = process.env.DATABASE_CLOUD || "mongodb+srv://riyabang617:riya2003@cluster0.hyg3u.mongodb.net/HomelyHub?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(DB, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false
        });
        console.log('MongoDB Database connected');
    } catch (err) {
        console.error('Mongoose connection error:', err.message);
    }
};

const port = process.env.PORT || 8000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, async () => {
        await connectDB();
        console.log(`HomelyHub is running locally on port: ${port}`);
    });
} else {
    const server = app.listen(port);
    server.on('listening', async () => {
        await connectDB();
    });
}

module.exports = app;
