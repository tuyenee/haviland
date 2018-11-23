const request = require('request');
const verificationEndpoint = 'www.google.com/recaptcha/api/siteverify';
const mySecretKey = '6LcUW3wUAAAAACdwNrj4a-YlS3BcHQ6NJRPSEEv5';

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

module.exports = function(req, res, done) {
    const receivedCaptcha = req.body['g-recaptcha-response'] || 'test';
    validateCaptcha(receivedCaptcha).then(function(success) {
        done();
    }, function(message) {
        req.flash('danger', message);
        res.redirect('/login');
    });
}