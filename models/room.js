const mongoose = require('mongoose');
const acl = require('../config/acl');

let RoomSchema = mongoose.Schema({
    building: {type: String, required: true, max: 24},
    address: {type: String, required: true, max: 100},
    number: {type: Number, required: true, max: 100000},
    occupant: {type: String, required: false},
    price: {type: Number, required: true, max: 10000000}
}, {collection: 'rooms'});

module.exports = mongoose.model("Rooms", RoomSchema);