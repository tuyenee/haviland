module.exports = function(app) {
    app.route('/user')
        .get((req, res) => {
            res.render('users');
        })
        .post((req, res) => {
            res.send('User post route')
        });
    app.route('/about')
        .get((req, res) => {
            res.render('about');
        })
}