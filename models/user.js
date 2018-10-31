const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name: {type: String, required: true, max: 100},
    username: {type: String, required: true, max: 50},
    password: {type: String, required: true, max: 100},
    email: {type: String, required: false, max: 100},
    age: {type: Number, required: false},
    admin: {type: Boolean, required: true}
}, {collection: 'users'});

module.exports = mongoose.model("Users", UserSchema);