const _PORT = 3000;
const express = require('express');
const app = express();
const ejsLayouts = require('express-ejs-layouts');

app.listen(_PORT, () => console.log("Server is running on port", _PORT ));


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