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

    user.save((err, next) => {
        if(err) {
            console.log(err);
        } else {
            res.send('User was created successfully');
        }
    });

};