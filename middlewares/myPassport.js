let LocalStrategy = require('passport-local').Strategy;
const NodeCache = require('node-cache');
const User = require('../models/user');
const SESSION_FIXATION_FIXED = process.env.SESSION_FIXATION_FIXED;
let captcha = require('./myCaptcha').verifyCaptcha;
let cacheFailedLogin = require('./myCache').cacheFailedLogin;

/* If LOGIN_BRUTE_FORCE_FIXED flag is not set, we make the captcha to always returns positive */
if(!process.env.LOGIN_BRUTE_FORCE_FIXED) {
    captcha = (req, res, done) => done()
}
// Logging failed attemp in cache
const failedLoginCacheKey = require('./myCache').failedLoginKey;
let myCache = require('./myCache').getCacheInstance();


module.exports.failedLoginCacheKey = failedLoginCacheKey;
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
        {passReqToCallback: true},
        function(req, username, password, done) {
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
                    // Incorect password. Log to cache this failed login attempt
                    let cachePromise = cacheFailedLogin(username);

                    // Only return when this big promise is resolved/rejected
                    cachePromise.then(function(resolved) {
                        // If more than 3 failed login attempt > require Captcha
                        if(resolved >= 3) req.session.shouldRequireCaptcha = true;
                        else req.session.shouldRequireCaptcha = false;
                        return done(null, false, { 
                            message: process.env.USERNAME_ENUMERATION_FIXED ? 'Incorect username or password.' : 'Incorrect password.' , 
                            type: 'danger' 
                        });
                    }, function(rejected) {
                        // TODO: Log incident.
                        return done(null, false, { 
                            message: process.env.USERNAME_ENUMERATION_FIXED ? 'Incorect username or password.' : 'Incorrect password.' , 
                            type: 'danger' 
                        }) 
                    }).catch((error) => {
                        console.log('Promise rejected with error', error);
                    })
                }
                else {
                    // After a successful login, I clear the failed login cache!
                    console.log('Removing cache', failedLoginCacheKey + username);
                    myCache.del(failedLoginCacheKey + username); // This is synchronous!
                    return done(null, user);
                }
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
                } else {
                    done();
                }
            },
            passport.authenticate('local', {
                failureRedirect: '/login',
                failureFlash: true,
            })
            , sessionRegenerator
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