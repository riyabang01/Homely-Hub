const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: [true, 'Booking must belong to a Property!']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User!']
    },
    price: {
        type: Number,
        required: [true, 'Booking transaction record must specify a total price.']
    },
    paid: {
        type: Boolean,
        default: true
    },
    fromDate: {
        type: Date,
        required: [true, 'Booking must specify a valid check-in date.']
    },
    toDate: {
        type: Date,
        required: [true, 'Booking must specify a valid check-out date.']
    },
    guests: {
        type: Number,
        required: [true, 'Booking must contain an active visitor tally.'],
        min: [1, 'Number of guests cannot be less than 1.']
    },
    numberOfNights: {
        type: Number,
        required: [true, 'Booking must contain a valid calculated night interval count.']
    }
}, {
    timestamps: true 
});

bookingSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name email phoneNumber avatar'
    }).populate({
        path: 'property',
        select: 'propertyName images address maximumGuest price'
    });
    next();
});

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
module.exports = Booking;
