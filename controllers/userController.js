const User = require('../models/user');

exports.test = (req, res) => {res.send('Hello from test controller')};
exports.index = (req, res) => {
    User.find((err, users) => {
        if(err) {
            return console.error(err);
        } else {
            res.render('users', {users:users});
        }
    });
};
exports.create = (req, res) => {
    let user = new User(
        {
            username: req.body.username,
            password: req.body.password,
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            admin: (req.body.admin === 'on')
        }
    );
    user.save((err) => {
        if(err) {
            return res.status(500).send(err);
        } else {
            return res.status(200).send(user);
        }
    });
};