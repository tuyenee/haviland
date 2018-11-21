let LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const SESSION_FIXATION_FIXED = process.env.SESSION_FIXATION_FIXED;
const captcha = require('./myCaptcha');

module.exports = function(app, passport) {

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, callback) => {
        callback(null, user.id)
    });
    passport.deserializeUser((id, callback) => {
        User.findById(id, (err, user) => callback(err, user))
    });

    passport.use(new LocalStrategy(
        function(username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) { 
                    return done(err); 
                }
                if (!user) {
                    return done(null, false, { 
                        message: process.env.USERNAME_ENUMERATION_FIXED ? 'Incorect username or password.' : 'Incorrect username.', 
                        type: 'danger' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { 
                        message: process.env.USERNAME_ENUMERATION_FIXED ? 'Incorect username or password.' : 'Incorrect password.' , 
                        type: 'danger' });
                }
                return done(null, user);
            });
        }
    ));
    
    /* If the flag SESSION_FIXATION_FIXED is ON, we will regenerate sessionId after login success */
    if(SESSION_FIXATION_FIXED) {
        let sessionRegenerator = function(req, res) {
            const temp = req.session.passport;
            req.session.regenerate(function(err) {
                req.session.passport = temp;
                req.session.save(function(err) {
                    res.redirect('/');
                })
            })
        };
        app.post(
            '/login',
            captcha,
            /* Because Passport hard-coded the "Missing credentials" message - I want to override it by this midleware*/
            (req, res, done) => {
                if(!req.body.username || !req.body.password) {
                    req.flash('danger', 'Missing credentials');
                    res.redirect('/login')
                } else done();
            },
            passport.authenticate('local', {
                failureRedirect: '/login',
                failureFlash: true,
            }),
            sessionRegenerator
        );
    } else {
        /* WITHOUT REGENERATING SESSION AFTER LOGIN */
        app.post(
            '/login',
            passport.authenticate('local', { 
                successRedirect: '/',
                failureRedirect: '/login',
                failureFlash: true
            })
        );
    }
}