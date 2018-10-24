const _PORT = 3000;

const app = require('express')();
app.listen(_PORT, () => console.log("Server is running on port", _PORT ));
app.get('/', (req, res) => res.send("Hello World!"));