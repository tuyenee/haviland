module.exports = function(app) {
    app.route('/about')
        .get((req, res) => {
            res.render('about', {
                currentUser: req.user
            });
        });
    app.route('/rooms')
        .get((req, res) => {
            res.render('rooms',  {
                currentUser: req.user
            });
        });
    app.route('/login')
        .get((req, res) => {
            res.render('login');
        });
    app.get('/', (req, res) => {
            res.render('index', {currentUser: req.user});
        }
    );
    app.get('/logout', (req, res) => {
        req.logout();
        req.flash('success', 'User logged out');
        res.redirect('/');
    });
}