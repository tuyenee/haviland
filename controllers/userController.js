const User = require('../models/user');

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
            req.flash('success', 'New user was created successfully.');
            return res.redirect('/users');
        }
    });
};

exports.delete = (req, res) => {
    User.findByIdAndRemove(req.body.id, err => {
        if(err) {
            req.flash('error', 'Failed to delete user. Please contact admin');
            return res.redirect('/users');
        }
        req.flash('success', 'User was deleted successfully');
        return res.redirect('/users');
    });
};

exports.update = (req, res) => {
    res.status(200).send('Update user data');
};

exports.view = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err) {
            req.flash('danger', 'User not found');
            return res.redirect('/users');
        }
        return res.render('user-view', {user});
    });
};

exports.edit = (req, res) => {
    const userData = {...req.body, admin: req.body.admin === "on"}
    User.findByIdAndUpdate(req.params.id, userData, {new: true}, (err, user) => {
        if(err) {
            req.flash('danger', 'Could not edit user. Please contact admin');
            res.render('user-view', {user});
        }
        else {
            req.flash('success', 'Changes were successfully saved.');
            res.render('user-view', {user:req.body});
        }
    });
};

exports.search = (req, res) => {
    const searchRegex = new RegExp(req.body.search, 'i');
    User.find({$or: [{username: searchRegex}, {name: searchRegex}]}, (err, users) => {
        if(err) return res.send(err);
        return res.render('users', {users: users, search: req.body.search});
    });
}