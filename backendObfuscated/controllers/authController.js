const User = require('../Models/userModel');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });
const { promisify } = require('util');
const sendEmail = require('../utils/Email');
const crypto = require('crypto');
const cloudinary = require('../utils/Cloudinary');

const signToken = (id) => {
    const secret = process.env.JWT_SECRET || "fallback_super_secret_homely_hub_key_2026";
    const expires = process.env.JWT_EXPIRES_IN || "90d";
    return jwt.sign({ id }, secret, { expiresIn: expires });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    const cookieOptions = {
        expires: new Date(Date.now() + (Number(process.env.JWT_COOKIE_EXPIRES_IN) || 90) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true
    };

    res.cookie('jwt', token, cookieOptions);
    user.password = undefined; 
    
    res.status(statusCode).json({
        status: 'success',
        token,
        user
    });
};

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

const defaultAvatarUrl = 'https://ftcdn.net';

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            avatar: {
                url: req.body.avatar || defaultAvatarUrl
            }
        });
        createSendToken(newUser, 201, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message || 'Login unsuccessful' });
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: 'none',
        secure: true
    });
    res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies && req.cookies.jwt && req.cookies.jwt !== 'loggedout') {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not Logged!! Please log in to get access' });
        }

        const secret = process.env.JWT_SECRET || "fallback_super_secret_homely_hub_key_2026";
        const decoded = await promisify(jwt.verify)(token, secret);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: "The user belonging to the token doesn't exist" });
        }

        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return res.status(401).json({ status: 'fail', message: 'User recently changed the password, Please login again' });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({ status: 'fail', message: err.message });
    }
};

exports.updateMe = async (req, res) => {
    try {
        if (req.body.password || req.body.passwordConfirm) {
            return res.status(400).json({ status: 'fail', message: 'This route is not for password updates. Please use /updatePassword.' });
        }

        const filteredBody = filterObj(req.body, 'name', 'phoneNumber');

        if (req.body.avatar !== undefined && req.body.avatar !== '') {
            const result = await cloudinary.uploader.upload(req.body.avatar, {
                folder: 'avatars',
                width: 150,
                height: 150,
                crop: 'scale'
            });
            filteredBody.avatar = {
                public_id: result.public_id,
                url: result.secure_url
            };
        }

        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            user: updatedUser
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Your current password is wrong' });
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();

        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'There is no user with this email' });
        }

        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const clientDomain = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetURL = `${clientDomain}/user/resetPassword/${resetToken}`;
        
        const message = `<p>Forgot your password? Click the link below to securely create a new password inside HomelyHub:</p>
                         <p><a href="${resetURL}" style="display: inline-block; padding:10px 20px; background-color: #007bff; border-radius:5px; text-decoration:none; color:white; font-size:16px; font-weight:bold;">Reset Password</a></p>`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'HomelyHub - Your password reset link (Valid for 10 mins)',
                message
            });

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email'
            });
        } catch (err) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(503).json({ status: 'fail', message: 'There was an error sending the email. Try again later!' });
        }
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
