module.exports = function(app) {
    app.route('/security-toggle').post((req, res) => {
        switch(req.body.target) {
            case 'SESSION_FIXATION_FIXED':
                if(process.env.SESSION_FIXATION_FIXED) process.env.SESSION_FIXATION_FIXED = '';
                else process.env.SESSION_FIXATION_FIXED = true;
                return res.json({
                    success: true,
                    newState: (process.env.SESSION_FIXATION_FIXED ? true : false)
                });
            case 'REFLECTED_XSS_FIXED':
                if(process.env.REFLECTED_XSS_FIXED) process.env.REFLECTED_XSS_FIXED = '';
                else process.env.REFLECTED_XSS_FIXED = true;
                return res.json({
                    success: true,
                    newState: (process.env.REFLECTED_XSS_FIXED ? true : false)
                });
            case 'DOM_BASED_XSS_FIXED':
                if(process.env.DOM_BASED_XSS_FIXED) process.env.DOM_BASED_XSS_FIXED = '';
                else process.env.DOM_BASED_XSS_FIXED = true;
                return res.json({
                    success: true,
                    newState: (process.env.DOM_BASED_XSS_FIXED ? true : false)
                });
            case 'CSRF_FIXED':
                if(process.env.CSRF_FIXED) process.env.CSRF_FIXED = '';
                else process.env.CSRF_FIXED = true;
                return res.json({
                    success: true,
                    newState: (process.env.CSRF_FIXED ? true : false)
                });
            case 'MONGO_QUERY_FIXED':
                if(process.env.MONGO_QUERY_FIXED) process.env.MONGO_QUERY_FIXED = '';
                else process.env.MONGO_QUERY_FIXED = true;
                return res.json({
                    success: true,
                    newState: (process.env.MONGO_QUERY_FIXED ? true : false)
                });
            case 'USERNAME_ENUMERATION_FIXED':
                if(process.env.USERNAME_ENUMERATION_FIXED) process.env.USERNAME_ENUMERATION_FIXED = '';
                else process.env.USERNAME_ENUMERATION_FIXED = true;
                return res.json({
                    success: true,
                    newState: (process.env.USERNAME_ENUMERATION_FIXED ? true : false)
                });
            case 'USERNAME_ENUMERATION_FIXED':
                if(process.env.USERNAME_ENUMERATION_FIXED) process.env.USERNAME_ENUMERATION_FIXED = '';
                else process.env.USERNAME_ENUMERATION_FIXED = true;
                return res.json({
                    success: true,
                    newState: (process.env.USERNAME_ENUMERATION_FIXED ? true : false)
                });
            case 'LOGIN_BRUTE_FORCE_FIXED':
                if(process.env.LOGIN_BRUTE_FORCE_FIXED) process.env.LOGIN_BRUTE_FORCE_FIXED = '';
                else process.env.LOGIN_BRUTE_FORCE_FIXED = true;
                return res.json({
                    success: true,
                    newState: (process.env.LOGIN_BRUTE_FORCE_FIXED ? true : false)
                });
            default:
                return res.json({
                    success: false
                });
        }
    })
}