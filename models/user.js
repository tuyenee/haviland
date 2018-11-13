const mongoose = require('mongoose');
const acl = require('../config/acl');
const crypto = require('crypto');
const Room = require('./room');
const SALT_LENGTH = 10;

let UserSchema = mongoose.Schema({
    name: {type: String, required: true, max: 100},
    username: {type: String, required: true, max: 50},
    password: {type: String, required: false, max: 100},
    salt: {type: String, required: false, max: 10},
    phone: {type: String, required: false, max: 20},
    email: {type: String, required: false, max: 100},
    age: {type: Number, required: false},
    reserving: {type: String, required: false},
    room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: false},
    admin: {type: Boolean, required: true}
}, {collection: 'users'});

const genRandomString = (length) => crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0, length);

const sha512 = function(password, salt){
    let hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return value;
};

/* User methods */
UserSchema.methods.setPassword = function(password) {
    this.salt = genRandomString(SALT_LENGTH);
    this.password = sha512(password, this.salt);
    return this;
}

UserSchema.methods.validPassword = function (password) {
    return sha512(password, this.salt) === this.password;
};

UserSchema.methods.isAdmin = function() {
    return this.admin;
};

UserSchema.methods.getRole = function() {
    if(this.isAdmin()) return acl.ROLE_ADMIN;
    return acl.ROLE_USER
};

UserSchema.methods.reserveRoom = function(roomId) {
    this.reserving = roomId;
    console.log('Saving user reservation', this.username, roomId);
    return this.save();
}

module.exports = mongoose.model("User", UserSchema);