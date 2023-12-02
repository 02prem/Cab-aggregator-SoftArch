require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/rider');

const db = require('./models');

const users = [
    { username: 'prem', password: 'password', phoneNr: 1234567890, emailID: "xyz@gmail.com" },
];

const rides = [
    { pickup: 'IIITB', dropoff: 'DMart' }
]

const seed = async () => {
    try{
        await db.Rider.deleteMany({});
        console.log('DROP ALL USERS');

        await Promise.all(
            users.map(async user => {
                const data = await db.Rider.create(user);
                await data.save();
            }),
        );

        console.log('CREATED USERS', JSON.stringify(users));

        await Promise.all(
            rides.map(async ride => {
                const created_ride = await db.Ride.create(ride);
                const cust = await db.Rider.findOne({ username: 'prem' });
                created_ride.customer = cust;
                cust.history.push(created_ride._id);
                await cust.save();
                await created_ride.save();
            }),
        );

        console.log('BOOKED RIDE');
    }
    catch(err){
        console.error(err);
    }
}

seed();