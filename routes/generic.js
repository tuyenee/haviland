module.exports = function(app) {
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
    app.get('/', (req, res) => {
            res.render('index', {currentUser: req.user});
        }
    );
}