const User = require('../models/user');

exports.index = (req, res) => {
    User.find((err, users) => {
        if(err) {
            return console.error(err);
        } else {
            if(process.env.CSRF_FIXED)
                res.render('users', {users:users, currentUser: req.user, csrfToken: req.csrfToken()});
            else
                res.render('users', {users:users, currentUser: req.user});
        }
    });
};

exports.create = (req, res) => {
    /* !! TODO: Prevent non-admin users set themself as admin !!*/
    let user = new User(
        {
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            admin: (req.body.admin === 'on')
        }
    );
    user.setPassword(req.body.password);
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

exports.view = (req, res) => {
    User.findById(req.params.id)
        .populate('room')
        .exec(function(err, user) {
            if(err) {
                console.log('ERROR---', err);
                req.flash('danger', 'User not found');
                return res.redirect('/users');
            }
            return res.render('user-view', {user: user, currentUser: req.user, csrfToken: req.csrfToken()});
        })
};

exports.edit = (req, res) => {  
    let user = User.findById(req.params.id, (err, user) => {
        if(err) {
            req.flash('danger', 'Could not save data');
            return res.redirect('/users/' + req.params.id);
        }
        if(req.body.password.length > 0) {
            // User wanted to change password
            user.setPassword(req.body.password);
            // This way we will also change the *salt*
        } 
        /* Populate new data (white list) */
        user.name = req.body.name;
        user.email = req.body.email;
        user.age = req.body.age;
        // Only admin can change extra info
        if(req.user.isAdmin()) {
            user.username = req.body.username
            user.admin = req.body.admin === 'on';
        }
        user.save((err) => {
            if(err) {
                return res.status(500).send(err);
            } else {
                req.flash('success', 'User data updated successfully.');
                res.redirect('/users/' + user.id);
            }
        });
    });
};

exports.search = (req, res) => {
    const searchRegex = new RegExp(req.body.search, 'i');
    User.find({$or: [{username: searchRegex}, {name: searchRegex}]}, (err, users) => {
        if(err) return res.send(err);
        return res.render('users', {users: users, search: req.body.search, currentUser: req.user});
    });
};

exports.update = (req, res) => {
    res.send('Updating user');
}