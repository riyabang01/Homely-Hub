const mongoose = require('mongoose');
const slugify = require('slugify');

const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: [true, 'Please enter your property name'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add information about your property.']
    },
    extraInfo: {
        type: String,
        default: 'Nestled in a tranquil neighborhood, the property exudes an aura of charm and elegance.'
    },
    propertyType: {
        type: String,
        enum: ['House', 'Flat', 'Guest House', 'Hotel'],
        default: 'House'
    },
    roomType: {
        type: String,
        enum: ['AnyType', 'Anytype', 'Room', 'Entire Room', 'Entire Home'],
        default: 'AnyType'
      },
    maximumGuest: {
        type: Number,
        required: [true, 'Please provide the maximum number of guests that can occupy this property.']
    },
    amenities: [{
        name: {
            type: String,
            required: true,
            enum: ['Wifi', 'Kitchen', 'Ac', 'Washing Machine', 'Tv', 'Pool', 'Free Parking']
        },
        icon: {
            type: String,
            required: true
        }
    }],
    images: {
        type: [{
            public_id: { type: String },
            url: { type: String, required: true }
        }],
        validate: {
            validator: function(val) {
                return val && val.length >= 5; 
            },
            message: 'The images array must contain at least 5 images.'
        }
    },
    price: {
        type: Number,
        required: [true, 'Please enter the Price per night value'],
        default: 500
    },
    address: {
        area: { type: String, required: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        pincode: { type: String, required: true } 
    },
    currentBookings: [{
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking'
        },
        fromDate: Date,
        toDate: Date,
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'A property listing must belong to a registered host user reference.']
    },
    slug: String,
    checkInTime: {
        type: String,
        default: '11:00'
    },
    checkOutTime: {
        type: String,
        default: '13:00'
    }
}, {
    timestamps: true
});


propertySchema.pre('save', function(next) {
    if (this.isModified('propertyName')) {
        this.slug = slugify(this.propertyName, { lower: true, strict: true });
    }
    next();
});


propertySchema.pre('save', function(next) {
    if (this.address && this.address.city) {
        
        this.address.city = this.address.city.trim();
    }
    next();
});


const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);
module.exports = Property;
