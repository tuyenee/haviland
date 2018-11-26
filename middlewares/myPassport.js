let LocalStrategy = require('passport-local').Strategy;
const NodeCache = require('node-cache');
const User = require('../models/user');
const SESSION_FIXATION_FIXED = process.env.SESSION_FIXATION_FIXED;
const captcha = require('./myCaptcha').verifyCaptcha;
const shouldRequireCaptcha = require('./myCaptcha').shouldRequireCaptcha;

// Logging failed attemp in cache
const failedLoginCacheKey = 'failedLogin_';
const cacheOptions = {
    stdTTL: 1800, // 30mins
    checkperiod: 900
};
// const myCache = new NodeCache(cacheOptions);
// TODO: beautify it
const myCacheService = require('./myCache');

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
        {
            passReqToCallback: true,
        },
        function(req, username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (err) {
                    console.log('ERROR - RETURNED') 
                    return done(err); 
                }
                if (!user) {
                    console.log('USER NO EXIST - RETURNED')
                    return done(null, false, { 
                        message: process.env.USERNAME_ENUMERATION_FIXED ? 'Incorect username or password.' : 'Incorrect username.', 
                        type: 'danger' });
                }
                if (!user.validPassword(password)) {
                    console.log('WRONG PASSWORD ')
                    // Incorect password. Log to cache this failed login attempt
                    let cachePromise = new Promise(function(resolve, reject) {
                        // get/set the cache here
                        let myCache = myCacheService.getCacheInstance(req);
                        myCache.get(failedLoginCacheKey + username, function(error, cache) {
                            console.log('READING CACHE in myPassport:', failedLoginCacheKey + username, cache);
                            if(error || typeof cache === 'undefined' || isNaN(cache.count)) {
                                // cache probably doesn't exist, create new cache blob with count = 1;
                                blob = {
                                    user: username,
                                    count: 1
                                }
                                myCache.set(failedLoginCacheKey + username, blob, function(error, success) {
                                    console.log('I set the cache', error, success, blob);
                                    if(error) {
                                        reject('Cache server is down. Please try again');
                                    }
                                    resolve(1); // Count of failed attempts
                                })
                            } else {
                                // there have been some failed attemp, we increase the count variable 
                                cache.count += 1;
                                console.log('current cache after incremetation', cache);
                                myCache.set(failedLoginCacheKey + username, cache, function(error, success) {
                                    if(error) {
                                        // TODO: Log if needed
                                    }
                                    resolve(cache.count);
                                })
                            }
                        })
                    });

                    // Only return when this big promise is resolved/rejected
                    cachePromise.then(function(resolved) {
                        console.log('cachePromise successssss', resolved)
                        return done(null, false, { 
                            message: process.env.USERNAME_ENUMERATION_FIXED ? 'Incorect username or password.' : 'Incorrect password.' , 
                            type: 'danger' 
                        });
                    }, function(rejected) {
                        console.log('cachePromise rejected', rejected)
                        // TODO: Log incident.
                        return done(null, false, { 
                            message: process.env.USERNAME_ENUMERATION_FIXED ? 'Incorect username or password.' : 'Incorrect password.' , 
                            type: 'danger' 
                        }) 
                    }).catch((error) => {
                        console.log('Promise rejected with error', error);
                    })
                }
                else return done(null, user);
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
            shouldRequireCaptcha,
            // captcha,
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
            //, sessionRegenerator
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