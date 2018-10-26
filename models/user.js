const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt-nodejs');

const UserSchema = mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.methods.generateHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

UserSchema.methods.validPassword = (password) => bcrypt.compareSync(password, this.local.password);

module.exports = mongoose.model("User", UserSchema);