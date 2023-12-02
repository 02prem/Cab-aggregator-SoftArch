const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');

const riderSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phoneNr: {
        type: Number,
        required: true
    },

    emailID: {
        type: String,
        required: true
    },

    // array of past rides
    history: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride'
    }]
});

riderSchema.pre('save', async function(next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }

        const hashed = await bcrypt.hash(this.password, 10);
        this.password = hashed;
        return next();
    } 
    catch (err) {
        return next(err);
    }
});

riderSchema.methods.comparePassword = async function(attempted, next){
    try{
        return await bcrypt.compare(attempted, this.password);
    }
    catch(err){
        return next(err);
    }
}

module.exports = mongoose.model('Rider', riderSchema);