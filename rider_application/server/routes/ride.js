const router = require('express').Router();
const db = require('../models');
const auth = require('../middlewares/auth');

router.post('/bookRide', auth, async (req, res, next) => {
    const {id} = req.decoded;
    const {pickup, dropoff} = req.body;

    try{
        const customer = await db.Rider.findById(id);

        if(!customer){
            throw new Error('No user found');
        }

        const booked = await db.Ride.create({
            customer,
            pickup,
            dropoff
        });

        const {bookingDate} = booked;

        customer.history.push(booked._id);
        await customer.save();

        res.status(201).json({pickup, dropoff, bookingDate});
    }   
    catch(err){
        err.status = 400;
        next(err);
    }
});

module.exports = router;