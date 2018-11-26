const request = require('request');
const failedLoginCacheKey = require('./myPassport').failedLoginCacheKey;
const NodeCache = require('node-cache');
const verificationEndpoint = 'www.google.com/recaptcha/api/siteverify';
const mySecretKey = '6LcUW3wUAAAAACdwNrj4a-YlS3BcHQ6NJRPSEEv5';

console.log('testttt', failedLoginCacheKey)

const validateCaptcha = function(captchaResponse) {
    return new Promise(function(resolve, reject) {
        const url = `https://${verificationEndpoint}?secret=${mySecretKey}&response=${captchaResponse}`;
        request(url, function(error, response, body) {
            body = JSON.parse(body);
            // Conditions here
            if(error) {
                reject('Could not verify captcha, please try again');
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
    const receivedCaptcha = req.body['g-recaptcha-response'] || 'test';
    validateCaptcha(receivedCaptcha).then(function(success) {
        done();
    }, function(message) {
        req.flash('danger', message);
        console.log('I sent header here!')
        res.redirect('/login');
    }).catch((error) => {
        console.log('Validating captcha promise: unexpected error:', error);
    });
}

const myPassport = require('./myPassport');
module.exports.shouldRequireCaptcha = function(req, res, done) {
    console.log('Check if user need to solve captcha');
    // Read cache for req.body.username
    const cacheOptions = {
        stdTTL: 1800, // 30mins
        checkperiod: 900
    };
    const myCacheService = require('./myCache');
    let myCache = myCacheService.getCacheInstance(req);

    const cacheKey = myPassport.failedLoginCacheKey + req.body.username;

    console.log('reading cache key:', cacheKey);
    myCache.get(cacheKey, function(error, cache) {
        console.log('READING CACHE in myCaptcha:', cache, error);
        if(!error && typeof cache != 'undefined') {
            console.log('type of count', cache.count);
            req.requireCaptcha = true;
            console.log('THIS LOGIN ATTEMPT SEEMS TO BE MALICIOUS - REQUIRE CAPTCHA');
        }
        done();
    })
}