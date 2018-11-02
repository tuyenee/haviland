let LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, callback) => callback(null, user.id));
    passport.deserializeUser((id, callback) => User.findById(id, (err, user) => callback(err, user)));

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { 
                    return done(err); 
                }
                if (!user) {
                    return done(null, false, { message: 'Incorrect username.', type: 'danger' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' , type: 'danger' });
                }
                return done(null, user);
            });
        }
    ));
        
    app.post('/login',
        passport.authenticate('local', { 
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })
    );
}