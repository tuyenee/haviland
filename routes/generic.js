const passport = require('passport');

module.exports = function(app) {
    app.route('/users')
        .get((req, res) => {
            res.render('users');
        })
        .post((req, res) => {
            res.send('User post route')
        });
    app.route('/about')
        .get((req, res) => {
            res.render('about');
        });
    app.route('/rooms')
        .get((req, res) => {
            res.render('rooms');
        });
    app.route('/login')
        .get((req, res) => {
            res.render('login');
        });
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    }));
        
}