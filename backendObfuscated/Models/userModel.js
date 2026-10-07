const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be at least 6 characters long'],
        select: false 
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
           
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match!'
        }
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide your phone number'],
        trim: true
    },
    avatar: {
        url: { 
            type: String, 
            default: '/assets/avatar.png' 
        },
        public_id: { type: String }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});


userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();


    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});


userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});


userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.methods.changedPasswordAfter = function (JWTSimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTSimestamp < changedTimestamp;
    }
    return false; 
};


userSchema.methods.createPasswordResetToken = function () {
   
    const resetToken = crypto.randomBytes(32).toString('hex');

   
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

   
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

   
    return resetToken;
};


const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;
