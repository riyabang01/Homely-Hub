const express = require('express');
const cors = require('cors'); 
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.set('trust proxy', 1);

const DB = process.env.DATABASE_CLOUD || "mongodb+srv://riyabang617:riya2003@cluster0.hyg3u.mongodb.net/HomelyHub?retryWrites=true&w=majority&appName=Cluster0";

let cachedConnection = global.mongoose;

if (!cachedConnection) {
    cachedConnection = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cachedConnection.conn) {
        return cachedConnection.conn;
    }

    if (!cachedConnection.promise) {
        mongoose.set('bufferCommands', false);
        cachedConnection.promise = mongoose.connect(DB, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000
        }).then((mongooseInstance) => {
            return mongooseInstance;
        });
    }

    try {
        cachedConnection.conn = await cachedConnection.promise;
    } catch (e) {
        cachedConnection.promise = null;
        throw e;
    }

    return cachedConnection.conn;
};

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ status: 'error', message: 'Database connection could not be established.' });
    }
});

app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use('/api/v1/rent/listing', propertyRoutes);
app.use('/v1/rent/listing', propertyRoutes);

app.use('/api/v1/rent/user', userRoutes);
app.use('/v1/rent/user', userRoutes);

app.use('/api/*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this API server!`
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
