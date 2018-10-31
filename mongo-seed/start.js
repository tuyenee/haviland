db.haviland.drop();
db.users.insertMany([
    {
        "name": "Joe Doe",
        "username": "jsmith",
        "password": "test",
        "email": "jsmith@gmail.com",
        "age": 40,
        "admin": true
    },
    {
        "name": "Jen Deer",
        "username": "jford",
        "password": "test",
        "email": "jford@gmail.com",
        "age": 45,
        "admin": false
    }
]);