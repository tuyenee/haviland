const Room = require('../models/room');
const User = require('../models/user');

exports.index = (req, res) => {
    Room.find((err, rooms) => {
        if(err) {
            return console.error(err);
        } else {
            res.render('rooms', {
                rooms:rooms, 
                currentUser: req.user, 
                csrfToken: req.csrfToken()
            });
        }
    });
};

exports.search = (req, res) => {
    const criteria = {};
    if(req.query.search) {
        const searchRegex = new RegExp(req.query.search, 'i');
        criteria.adress = searchRegex;
    }
    if(req.query.maxPrice) {
        criteria.$where = "this.price <= " + req.query.maxPrice;
    }
    
    Room.find(criteria, (err, rooms) => {
        if(err) {
            console.log('Error from Mongo:', err);
            return res.send(err);
        }
        return res.render('rooms', {
            rooms: rooms, 
            search: req.query.search, 
            maxPrice: req.query.maxPrice, 
            currentUser: req.user,
            csrfToken: req.csrfToken()
        });
    });
};

exports.create = (req, res) => {
    Room.create(req.body, (err, room) => {
        if(err) {
            req.flash('danger', 'Could not create room. Please try again');
            res.redirect('/rooms');
        } else {
            req.flash('success', `Room ${room.number}/${room.building} - ${room.address} (${room.price}) was created successfully.`);
            res.redirect('/rooms');
        }
    })
};

exports.delete = (req, res) => {
    // Script: method post, req.body.roomId => roomId
    Room.deleteOne({_id: req.body.roomId}, (err) => {
        if(err) {
            req.flash('danger', 'Could not delete room. Please try again');
            res.redirect('/rooms');
        } else {
            req.flash('success', 'Room was deleted successfully');
            res.redirect('/rooms');
        }
    });
};

exports.view = (req, res) => {
    Room.findById(req.params.id)
        .populate('occupant')
        .exec(function(err, room) {
            if(err) {
                console.log('ERRORRR', err);
                req.flash('danger', 'Some error happened');
                return res.redirect('/rooms');
            }
            return res.render('room-view', {
                room: room, 
                currentUser: req.user, 
                csrfToken: req.csrfToken()
            });
        });
};

exports.edit = (req, res) => {
    res.send('Edit a room');
};

exports.reserve = (req, res) => {
    if(typeof req.user === 'undefined') res.send(403);
    else {
        const roomId = req.body.id;
        console.log('Reserving room:', roomId);
        let room = Room.findById(roomId, (err, room) => {
            res.setHeader('Content-Type', 'application/json');
            if(err) {
                res.send(JSON.stringify({ result: {message:'Error. Please try again'} }));
            }
            req.user.reserveRoom(room.id);
            room.saveNewReservation(req.user);
            res.send(JSON.stringify({
                result: {
                    message: 'Success',
                    room: room
                }
            }));
        });
    }
};

exports.release = (req, res) => {
    const roomId = req.body.roomId;
    Room.findByIdAndUpdate(roomId, {$set: {occupant: undefined}}, {new: false}, (err, room) => {
        if(err) {
            res.send(err);
        } else {
            room.update()
            User.updateOne({_id: room.occupant}, {room: undefined}, (err, raw) => {
                if(err) {
                    console.log('Error while updating user state');
                } else {
                    res.send('Released successfully');
                }
            })
        }
    })
}

exports.processReservation = (req, res) => {
    // res.send('Processing your request ' + req.body.roomId + req.body.userId + req.body.action);
    const roomId = req.body.roomId;
    const userId = req.body.userId;
    const action = req.body.action;

    switch(action) {
        // TODO: action names should not be hard coded. Define constants!
        case 'reject':
            // BIG TODO: Rewrite ugly nested callbacks to chaining promises
            //TODO: get the room, get reservation, loop thru, find reservations with userId, pop it out, save reservation, respond
            let room = Room.findById(roomId, (err, room) => {
                if(err) {
                    // TODO: error handling
                    res.send('Error. Please try again');
                }
                console.log('Room reservation: ', room.reservation);
                room.reservation = room.reservation.filter(function(value, index, array) {
                    console.log('filtering by userId', userId);
                    value.userId != userId;
                });
                console.log('Room reservation after filter:', room.reservation);
                room.save((err, saved) => {
                    if(err) {
                        // TODO: Error handling
                        console.log('Error while updating room reservation', err);
                        res.send('Error. Please try again');
                    }
                    User.update({_id: userId}, {$unset: {reserving: 1 }}, (err) => {
                        if(err) {
                            console.log('Error while updating user state')
                        } else                
                            // TODO: proper respond
                            res.send('Reservation processed succesfully');
                    });
                });
            });
            break;
        case 'accept':
            // SCRIPT: update the room byId, set the occupant field, update the user: unset reserving & set room
            Room.updateOne({_id: roomId}, {
                $unset: {reservation: 1},
                occupant: userId
            }, (err) => {
                if(err) {
                    console.log('Error when trying to update room state');
                    res.send('Error. Please try again');
                }
            }).then(() => {
                console.log('Updating user state', userId, roomId);
                User.updateOne({_id: userId}, {
                    reserving: undefined,
                    room: roomId
                }, (err, raw) => {
                    if(err) {
                        console.log('Error when updating user state', err);
                        
                    }
                    console.log('Mongo response:', raw);
                    res.send('Processed successfully!');
                })
            });
            break;
    }
}