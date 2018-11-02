const mongoose = require('mongoose');

let UserSchema = mongoose.Schema({
    name: {type: String, required: true, max: 100},
    username: {type: String, required: true, max: 50},
    password: {type: String, required: true, max: 100},
    email: {type: String, required: false, max: 100},
    age: {type: Number, required: false},
    admin: {type: Boolean, required: true}
}, {collection: 'users'});

UserSchema.methods.validPassword = function (password) {
    return password === this.password;
};

module.exports = mongoose.model("Users", UserSchema);