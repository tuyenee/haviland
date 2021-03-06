const mongoose = require('mongoose');
const acl = require('../config/acl');
const User = require('./user');

let RoomSchema = mongoose.Schema({
    building: {type: String, required: true, max: 24},
    address: {type: String, required: true, max: 100},
    number: {type: Number, required: true, max: 100000},
    occupant: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false},
    price: {type: Object, required: true, max: 10000000},
    secret: {type: String, required: false},
    reservation: {type: Array, required: false}
}, {collection: 'rooms'});

RoomSchema.methods.saveNewReservation = function(user) {
    if(typeof this.reservation != 'object') this.reservation = [];
    const newReservation = {
        userId: user.id,
        name: user.name,
        phone: user.phone,
        created: (new Date().toISOString())
    };
    this.reservation.push(newReservation);
    this.save(function(err, saved) {
        if(err) {
            // TODO: err handling
            throw err;
        }
    });
}
module.exports = mongoose.model("Room", RoomSchema);