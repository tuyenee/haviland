const ROLE_ADMIN = 'admin';
const ROLE_USER = 'user';
const ROLE_GUEST = 'guest';

/*
 * Allows users with specific role to access resource
 * Allows users to access their own resource (data)
 * (Callback) grantAccessToOwnResource = (req) => resourceId
 *  Access granted if requesting user id matches resourceId 
 */
const requireRole = function (role, grantAccessToOwnResource = undefined) {
    return function(req, res, next) {
        if(typeof req.user === 'undefined') {
            req.flash('danger', 'You need to log in');
            res.redirect('/login');
        } else if(req.user.getRole() === role) {
            next();
        } else if(typeof grantAccessToOwnResource === 'function') {
            if(req.user.id === grantAccessToOwnResource(req)) next();
            else {
                res.send('You are not allowed to modify this resource');
            }
        } else {
            res.send(403);
        }
    }
};

module.exports = {
    ROLE_ADMIN: ROLE_ADMIN,
    ROLE_USER: ROLE_USER,
    ROLE_GUEST: ROLE_GUEST,
    requireRole: requireRole
};