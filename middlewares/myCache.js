const NodeCache = require('node-cache');

const cacheOptions = {
    stdTTL: 1800, // 30mins
    checkperiod: 900
};

module.exports.getCacheInstance = function(req) {
    if(typeof req.myFCache === 'undefined') {
        console.log('I created a new cache instance');
        let myCache = new NodeCache(cacheOptions)
        req.myFCache = myCache;
        console.log('List of keys:', myCache.keys());
        return myCache;
    } else {
        console.log('I returned cache in request');
        console.log('List of keys:', req.myFCache.keys());
        return req.myFCache;
    }
}