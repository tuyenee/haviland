const _PORT = 8080;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const User = require('./models/user');
const ejsLayouts = require('express-ejs-layouts');

app.listen(_PORT, () => console.log("Server is running on port", _PORT ));

/* Initialize Passport */
app.use(passport.initialize());
app.use(passport.session());

/* Static files */
app.use(express.static('public'));

/* View engine */
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(ejsLayouts);

/* Routing */
const genericRoute = require('./routes/generic');
genericRoute(app);

app.get('/', (req, res) => {
        res.render('index');
    }
);