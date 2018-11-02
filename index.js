const _PORT = 8080;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejsLayouts = require('express-ejs-layouts');
const flash = require('express-flash-messages');
const session = require('express-session');
const myPassport = require('./middlewares/myPassport');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


app.listen(_PORT, () => console.log("Server is running on " + _PORT + ', will be mapped to 8087' ));

/* Mongo connection */
const mongoDb = 'mongodb://mongo:27017';
console.log('READ from the ENV:  ', process.env.MONGO_INITDB_DATABASE);
mongoose.connect(mongoDb, {
    authSource: process.env.MONGO_INITDB_AUTH_DATABASE,
    auth: {user: process.env.MONGO_INITDB_ROOT_USERNAME, password: process.env.MONGO_INITDB_ROOT_PASSWORD},
    dbName: process.env.MONGO_INITDB_DATABASE,
    useNewUrlParser: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error:'));


/* session */
app.use(session({
    secret: 'session-secret'
}));

/* Body Parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* Flash messages */
app.use(flash());

/* Static files */
app.use(express.static('public'));

/* View engine */
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(ejsLayouts);

/* Routing */
const genericRoute = require('./routes/generic');
const usersRoute = require('./routes/users');
genericRoute(app);
app.use('/users', usersRoute);

app.get('/', (req, res) => {
        res.render('index');
    }
);

/* Passport */
const User = require('./models/user');

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, callback) => callback(null, user.id));
passport.deserializeUser((id, callback) => User.findById(id, (err, user) => callback(err, user)));

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
        if (err) { 
            return done(err); 
        }
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' , type: 'danger' });
        }
        return done(null, user);
    });
  }
));


app.post('/login',
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
);