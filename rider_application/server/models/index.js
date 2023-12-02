const mongoose = require('mongoose');

mongoose.set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/rider");

module.exports.Rider = require('./rider');
module.exports.Ride = require('./ride');
