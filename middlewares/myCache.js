const NodeCache = require('node-cache');

const cacheOptions = {
    stdTTL: 1800, // 30mins
    checkperiod: 900
};

let _this = this;

module.exports.failedLoginKey = 'failedLogin_';

module.exports.getCacheInstance = function() {
    if(typeof global.myFCache === 'undefined') {
        let myCache = new NodeCache(cacheOptions)
        global.myFCache = myCache;
        return myCache;
    } else {
        return global.myFCache;
    }
}

module.exports.cacheFailedLogin = function(username) {
    return new Promise(function(resolve, reject) {
        let myCache = module.exports.getCacheInstance();
        myCache.get(_this.failedLoginKey + username, function(error, cache) {
            if(error || typeof cache === 'undefined' || isNaN(cache.count)) {
                // cache probably doesn't exist, create new cache blob with count = 1;
                console.log('No failed login cache was found for', username, ', this looks like 1st failed attempt!');
                blob = {
                    user: username,
                    count: 1
                }
                myCache.set(_this.failedLoginKey + username, blob, function(error, success) {
                    if(error) {
                        reject('Cache server is down. Please try again');
                    }
                    resolve(1); // Count of failed attempts
                })
            } else {
                // there have been some failed attemp, we increase the count variable 
                cache.count += 1;
                console.log('Failed login attempts for', username, cache.count);
                myCache.set(_this.failedLoginKey + username, cache, function(error, success) {
                    if(error) {
                        // TODO: Log if needed
                    }
                    resolve(cache.count);
                })
            }
        })
    });
}