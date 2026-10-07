const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config.env') });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRECT_KEY);
const Property = require('../Models/propertyModel');
const Booking = require('../Models/bookingModel');
const moment = require('moment');

exports.getcheckOutSession = async (req, res) => {
    const amount = req.body.amount || req.body.totalPrice;
    const { currency, paymentMethodTypes, propertyName } = req.body;
    
    try {
        if (!amount) {
            return res.status(400).json({ error: 'Missing calculation amount field metrics.' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency || 'inr',
            payment_method_types: paymentMethodTypes || ['card'],
            description: 'HomelyHub Stay Reservation Checkout',
            metadata: {
                propertyName: typeof propertyName === 'string' ? propertyName : JSON.stringify(propertyName)
            }
        });
        
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        console.error("Stripe intent generation error: ", err);
        res.status(500).json({ error: err.message });
    }
};

exports.createBookings = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ status: 'fail', message: 'Authentication required. Please log in first.' });
        }

        const property = req.body.property || req.body.propertyId;
        const price = req.body.price || req.body.totalPrice;
        
        const finalGuests = req.body.guests || req.body.totalGuests || req.body.numberOfGuests || 1;

        const fromDate = req.body.fromDate || req.body.checkinDate;
        const toDate = req.body.toDate || req.body.checkoutDate;

        if (!property || !fromDate || !toDate) {
            return res.status(400).json({ status: 'fail', message: 'Missing core target listing date profiles.' });
        }
        
        const start = moment(fromDate, "YYYY-MM-DD");
        const end = moment(toDate, "YYYY-MM-DD");
        const numberOfNights = req.body.numberOfNights || req.body.nights || end.diff(start, 'days');

        const targetProperty = await Property.findById(property);
        if (!targetProperty) {
            return res.status(404).json({ status: 'fail', message: 'Target accommodation record not found.' });
        }

        const newBooking = await Booking.create({
            property,
            price,
            guests: Number(finalGuests),
            fromDate,
            toDate,
            numberOfNights: numberOfNights,
            user: req.user._id
        });

        const updatedProperty = await Property.findByIdAndUpdate(
            property,
            {
                $push: {
                    currentBookings: {
                        bookingId: newBooking._id,
                        fromDate: fromDate,
                        toDate: toDate,
                        userId: newBooking.user,
                        guests: newBooking.guests
                    }
                }
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: 'success',
            booking: newBooking,
            updatedProperty: updatedProperty
        });

    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const userBookings = await Booking.find({ user: req.user._id })
            .populate('property', 'propertyName images address maximumGuest price')
            .sort('-createdAt');
        
        res.status(200).json({
            status: 'success',
            bookings: userBookings
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const bookingDetails = await Booking.findById(req.params.bookingId).populate('property');
        
        if (!bookingDetails) {
            return res.status(404).json({ status: 'fail', message: 'Booking reference not found.' });
        }

        res.status(200).json({
            status: 'success',
            booking: bookingDetails
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
