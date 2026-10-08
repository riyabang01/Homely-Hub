const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

const DB = process.env.DATABASE_CLOUD || "mongodb+srv://riyabang617:riya2003@cluster0.hyg3u.mongodb.net/HomelyHub?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        mongoose.set('bufferCommands', false);
        await mongoose.connect(DB, {
            serverSelectionTimeoutMS: 8000,
            socketTimeoutMS: 45000
        });
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use(cors({
    origin: true, 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api/v1/rent/listing', propertyRoutes);
app.use('/api/v1/rent/user', userRoutes);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: err.status || 'error',
        message: err.message || 'Internal server error encountered.'
    });
});

module.exports = app;
