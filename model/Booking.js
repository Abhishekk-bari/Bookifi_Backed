const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    name: String,
    number: Number,
    email: String,
    message: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Booking', bookingSchema);
