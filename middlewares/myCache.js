const NodeCache = require('node-cache');

const cacheOptions = {
    stdTTL: 1800, // 30mins
    checkperiod: 900
};

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