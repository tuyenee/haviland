const _PORT = 8080;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejsLayouts = require('express-ejs-layouts');
const flash = require('express-flash-messages');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


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
    secret: 'session-secret',
    store: new MongoStore({mongooseConnection: db})
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


/* Passport */
const passport = require('passport');
const myPassport = require('./middlewares/myPassport');
myPassport(app, passport);


/* Routing */
const genericRoute = require('./routes/generic');
const usersRoute = require('./routes/users');
const roomsRoute = require('./routes/rooms');
genericRoute(app);
app.use('/users', usersRoute);
app.use('/rooms', roomsRoute);
