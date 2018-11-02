// const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(app, passport) {
    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/success', (req, res) => res.send('Logged in successfully'));
    app.get('/error', (req, res) => res.send('Wrong credentialsssss'));

    console.log('My Passport got called');
    passport.serializeUser((user, callback) => callback(null, user.id));

    passport.deserializeUser((id, callback) => User.findById(id, (err, user) => callback(err, user)));

    passport.use(new LocalStrategy(
        function(username, password, done) {
            console.log('Attemp to login: ', username, password);
            User.findOne({
              username: username
            }, function(err, user) {
                console.log('Found the following user in database: ', user.username, user.password);
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false);
                }

                if (user.password != password) {
                    return done(null, false);
                }
                return done(null, user);
            });
        }
    ));
    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/error' }),
        (req, res) => res.redirect('/success')
    );
}