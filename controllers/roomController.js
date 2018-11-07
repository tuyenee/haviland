const Room = require('../models/room');

exports.index = (req, res) => {
    Room.find((err, rooms) => {
        if(err) {
            return console.error(err);
        } else {
            res.render('rooms', {rooms:rooms, currentUser: req.user});
        }
    });
};

exports.search = (req, res) => {
    res.send('Search for room');
};

exports.create = (req, res) => {
    res.send('Create room');
};

exports.delete = (req, res) => {
    res.send('Delete room');
};

exports.view = (req, res) => {
    Room.findById(req.params.id, (err, room) => {
        if(err) {
            req.flash('danger', 'Room not found');
            return res.redirect('/rooms');
        }
        return res.render('room-view', {room: room, currentUser: req.user});
    });
};

exports.edit = (req, res) => {
    res.send('Edit a room');
};