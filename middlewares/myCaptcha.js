const request = require('request');
const NodeCache = require('node-cache');
const verificationEndpoint = 'www.google.com/recaptcha/api/siteverify';
const mySecretKey = '6LcUW3wUAAAAACdwNrj4a-YlS3BcHQ6NJRPSEEv5';
const failedLoginKey = require('./myCache').failedLoginKey;
let _this = this;

const validateCaptcha = function(captchaResponse) {
    return new Promise(function(resolve, reject) {
        if(!captchaResponse) return reject('Please solve the provided captcha');
        const url = `https://${verificationEndpoint}?secret=${mySecretKey}&response=${captchaResponse}`;
        request(url, function(error, response, body) {
            body = JSON.parse(body);
            // Conditions here
            if(error) {
                reject('Could not verify captcha. Hint: your Node server cannot connect to the Google reCaptcha server');
            }
            if(body.success) {
                resolve(true);
            } else {
                reject('Please solve the provided captcha');
            }
        })
    });
}

module.exports.verifyCaptcha = function(req, res, done) {
    _this.shouldRequireCaptcha(req.body.username).then(function(resolved) {
        if(resolved) {  // resolved true means should require captcha
            const receivedCaptcha = req.body['g-recaptcha-response'];
            validateCaptcha(receivedCaptcha).then(function(resolved) {
                done();
            }, function(rejected) {
                req.flash('danger', rejected);
                res.redirect('/login');
            }).catch((error) => {
                console.log('Validating captcha promise: unexpected error:', error);
            });
        } else {        // resolved false means captcha should not be required
            done();
        }
    }, function(rejected) {
        done();
    }).catch(function(error) {
        done();
    })
}

/*
 * @return Promise - resolve to true/false
 */
module.exports.shouldRequireCaptcha = function(username) {
    return new Promise(function(resolve, reject) {
        let myCache = require('./myCache').getCacheInstance();
        const cacheKey = failedLoginKey + username;
        myCache.get(cacheKey, function(error, cache) {
            if(error) {
                console.log('ERROR:', error)
                return reject('Cache server is down. Please contact admin');
            }
            if(typeof cache == 'undefined' || cache.count < 3) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    });
}