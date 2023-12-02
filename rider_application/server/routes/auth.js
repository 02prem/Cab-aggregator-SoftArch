const router = require('express').Router(); // import express and create instance of Router
const db = require('../models');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

// route for POST request to './register'
router.post('/register', async function(req, res, next) {
    try{
        const {id, username, password, phoneNr, emailID} = req.body;

        const check = await db.Rider.findOne({phoneNr: req.body.phoneNr, });
        if(check){
            throw new Error('This phone number is already registered');
        }
        
        const user = await db.Rider.create(req.body);
        // {id, username, password, phoneNr, emailID} = user;

        const token = jwt.sign({id, username}, process.env.SECRET);

        res.status(201).json({id, username, password, phoneNr, emailID, token});
    }
    catch(err){
        if(err.code == 11000){
            err.message = 'Sorry, this username is already taken';
        }

        next(err);
    }
});

router.post('/login', async function(req, res, next) {
    try{
        const user = await db.Rider.findOne({ username: req.body.username, });
        const {id, username, password} = user;

        const valid = await user.comparePassword(req.body.password);
        if(valid){
            const token = jwt.sign({id, username}, process.env.SECRET);

            res.json({id, username, password, token});
        }
        else{
            throw new Error();
        }
    }
    catch(err){
        err.message = 'Invalid Username/password';
        next(err);
    }
});

router.route('/profile').get(
    auth, async (req, res, next) => {
        const { id } = req.decoded;
        try{
            const user = await db.Rider.findById(id);

            if(!user){
                throw new Error('No user found');
            }

            const {username, phoneNr, emailID} = user;

            res.status(200).json({username, phoneNr, emailID});
        }
        catch(err){
            err.status = 400;
            next(err);
        }
    }
);

router.route('/history').get(
    auth, async (req, res, next) => {
        const {id} = req.decoded;

        try{
            const user = await db.Rider.findById(id);
            if(!user){
                throw new Error('No user found');
            }

            const {history} = user;

            res.status(200).json(history);
        }
        catch(err){
            err.status = 400;
            next(err);
        }
    }
)

router.route('/:id').get(
    auth, async (req, res, next) => {
        try{
            const {id: userid} = req.decoded;
            const {id: rideid} = req.params;

            const user = await db.Rider.findById(userid);

            if(!user){
                throw new Error('No user found');
            }

            const ride = await db.Ride.findById(rideid);

            if(!ride){
                throw new Error('Invalid ride');
            }

            res.status(200).json(ride);
        }
        catch(err){
            err.status = 400;
            next(err);
        }
    }
)

module.exports = router;