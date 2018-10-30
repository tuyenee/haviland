const _PORT = 8080;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoDb = 'mongodb://mongo:27017/haviland';
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('./models/user');
const ejsLayouts = require('express-ejs-layouts');

app.listen(_PORT, () => console.log("Server is running on " + _PORT + ', will be mapped to 8087' ));

/* Mongo connection */
mongoose.connect(mongoDb, {useNewUrlParser: true});
//mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongo connection error:'));


/* Body Parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


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