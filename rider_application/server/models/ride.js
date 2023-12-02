const mongoose = require('mongoose');
const moment = require('moment-timezone');

const rideSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rider'
    },
    
    pickup: {
        type: String,
        required: true
    },

    dropoff: {
        type: String,
        required: true
    },

    bookingDate: {
        type: Date,
        default: Date.now,
    },
});

rideSchema.pre('save', async function(next) {
    try{
        const date = await moment().tz('Asia/Kolkata').toDate();
        this.bookingDate = date;
        return next();
    }
    catch(err){
        return next(err);
    }
})

module.exports = mongoose.model('Ride', rideSchema);