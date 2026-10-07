const cloudinary = require('cloudinary').v2;
const path = require('path');


require('dotenv').config({ path: path.join(__dirname, '../config.env') });


if (!process.env.CLOUD_NAME || !process.env.CLOUD_KEY || !process.env.CLOUD_KEY_SECRET) {
    console.warn(
        "⚠️ WARNING: Cloudinary credentials are missing from config.env. Profile image and asset media uploads will fail."
    );
}


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_KEY_SECRET
});

module.exports = cloudinary;
